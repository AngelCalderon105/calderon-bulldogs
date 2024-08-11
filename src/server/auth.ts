import NextAuth, { NextAuthOptions, getServerSession, DefaultSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";
import { db } from "~/server/db";
import { env } from "~/env";

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
  adapter: PrismaAdapter(db || new PrismaClient()) as Adapter,
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
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
};

// Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
export const getServerAuthSession = async () => {
  return getServerSession(authOptions);
};


