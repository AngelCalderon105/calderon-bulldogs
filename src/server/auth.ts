import { prisma } from '~/server/db'; //import client from db.ts
import NextAuth, { NextAuthOptions, getServerSession, DefaultSession } from "next-auth";
import { TRPCError } from '@trpc/server'
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from 'crypto'; //generates secure random tokens
import { Adapter } from "next-auth/adapters";
import { db } from "~/server/db";
import { env } from "~/env";
import { sendResetEmail } from '~/lib/email'; // Add this line at the top


// Module augmentation for `next-auth` types. This allows you to add custom properties to the `session` object.
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// Define the NextAuth options
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        console.log("user", user);

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          return null; // Invalid password, triggers the error page
        }

        return { ...user, id: user.id }; // Successful login, returns the user object
      },
    }),
    // Add more providers if needed
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
  
      return token;
    },
  
    async session({ session, token }) {
      // Type assertion to tell TypeScript that token.email and token.id are strings
      if (token.email) {
        session.user.email = token.email; // Cast token.email to string
      }
      session.user.id = token.id as string; // Cast token.id to string
  
      return session;
    },
  }
  
};

// Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
export const getServerAuthSession = async () => {
  return getServerSession(authOptions);
};

// Function to generate a random token
const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
};

export const requestPasswordReset = async (email: string) => {
  // Step 1: Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  // Step 2: Generate a reset token (plain token)
  const token = crypto.randomBytes(32).toString('hex');
  
  // Step 3: Hash the token
  const hashedToken = await bcrypt.hash(token, 10);

  // Step 4: Store the hashed token in the password_reset_token table
  const expiresAt = new Date(Date.now() + 3600 * 1000); // Token expires in 1 hour
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,  // Store the hashed token
      expiresAt,
    },
  });

  // Step 5: Send the email with the plain token (not the hashed token)
  await sendResetEmail(user.email, token); // Pass the plain token
};


export const resetPassword = async (token: string, newPassword: string) => {
  // Step 1: Find the reset token record from the database
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      expiresAt: { gte: new Date() },  // Ensure token hasn't expired
    },
  });

  if (!resetToken) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid or expired token' });
  }

  // Step 2: Compare the raw token (from URL) with the hashed token in the database
  const isTokenValid = await bcrypt.compare(token, resetToken.token);
  if (!isTokenValid) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid or expired token' });
  }

  // Step 3: Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Step 4: Update the user's password
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Step 5: Delete the used reset token
  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
};

