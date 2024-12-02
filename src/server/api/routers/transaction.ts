// server/api/trpc/transaction.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { db } from "~/server/db"; // Adjust to your actual database client import

export const transactionRouter = createTRPCRouter({
  createTransaction: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
        customerPhone: z.string(),
        puppyId: z.number(),
        price: z.number(),
        paymentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const transaction = await db.transaction.create({
        data: {
          transactionId: input.transactionId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          puppyId: input.puppyId,
          price: input.price,
          paymentType: input.paymentType,
        },
      });
      return transaction;
    }),
    
    createReservation: publicProcedure
  .input(
    z.object({
      transactionId: z.string(),
      customerName: z.string(),
      customerEmail: z.string(),
      customerPhone: z.string(),
      puppyId: z.number(),
      price: z.number(),
      reservedUntil: z.date(),
    })
  )
  .mutation(async ({ input }) => {
    // Create reservation in the Transaction table
    const transaction = await db.transaction.create({
      data: {
        transactionId: input.transactionId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        puppyId: input.puppyId,
        price: input.price,
        paymentType: "Reservation",
        reservedUntil: input.reservedUntil,
      },
    });

    // Update Puppy status and reservedUntil
    await db.puppy.update({
      where: { id: input.puppyId },
      data: {
        status: "Reserved",
        reservedUntil: input.reservedUntil,
      },
    });

    return transaction;
  }),

    
});
