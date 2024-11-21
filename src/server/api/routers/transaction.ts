// server/api/trpc/transaction.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { db } from "~/server/db"; // Adjust to your actual database client import

export const transactionRouter = createTRPCRouter({
  createTransaction: publicProcedure
    .input(
      z.object({
        paypalCustomerId: z.string(),
        transactionId: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
        customerPhone: z.string(),
        puppyId: z.number(),
        price: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const transaction = await db.transaction.create({
        data: {
          paypalCustomerId: input.paypalCustomerId,
          transactionId: input.transactionId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          puppyId: input.puppyId,
          price: input.price
        },
      });
      return transaction;
    }),
});
