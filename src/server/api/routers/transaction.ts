// server/api/trpc/transaction.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { db } from "~/server/db"; // Adjust to your actual database client import

export const transactionRouter = createTRPCRouter({
  createTransaction: publicProcedure
    .input(
      z.object({
        paypalCustomerId: z.string(), // PayPal customer ID
        transactionId: z.string(),
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string(),
        studId: z.number(), // ID of the associated Stud
      })
    )
    .mutation(async ({ input }) => {
      // Create a new transaction record in the database
      const transaction = await db.transaction.create({
        data: {
          paypalCustomerId: input.paypalCustomerId,
          transactionId: input.transactionId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          studId: input.studId,
        },
      });
      return transaction;
    }),
});
