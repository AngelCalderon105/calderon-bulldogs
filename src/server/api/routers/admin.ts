import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db"; 
import { hash } from "bcryptjs";
import { getServerAuthSession } from "~/server/auth"; 


export const adminRouter = createTRPCRouter({
  updateEmail: protectedProcedure
    .input(
      z.object({
        newEmail: z.string().email(), // Require the new email
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated.",
        });
      }

      // Check if the new email already exists in the database
      const emailExists = await db.user.findUnique({
        where: { email: input.newEmail },
      });

      if (emailExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "New email is already in use.",
        });
      }

      // Update the user's email in the database
      await db.user.update({
        where: { id: userId }, // Use the user ID from the session
        data: { email: input.newEmail },
      });

      // Force session to update by refreshing the session
      const updatedSession = await getServerAuthSession();
      return { message: "Email updated successfully.", session: updatedSession };
    }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        newPassword: z.string().min(6), // Require the new password with a minimum length
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get the user's current email from the session
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated.",
        });
      }

      // Hash the new password before storing it in the database
      const hashedPassword = await hash(input.newPassword, 10); 

     
      await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword }, 
      });

      return { message: "Password updated successfully." };
    }),
});
