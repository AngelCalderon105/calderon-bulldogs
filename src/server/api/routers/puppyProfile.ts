// server/api/trpc/puppyProfile.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "~/server/api/trpc";
import { db } from "~/server/db";

export const puppyProfileRouter = createTRPCRouter({
    createPuppy: publicProcedure
      .input(z.object({
        name: z.string(),
        birthdate: z.string(),
        color: z.string(),
        status: z.string(),
        price: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { name, birthdate, color, status, price } = input;
        const newPuppy = await db.puppy.create({
          data: {
            name,
            birthdate: new Date(birthdate), // Convert string to Date
            color,
            status,
            price,
          },
        });
        return newPuppy;
      }),
      listPuppies: publicProcedure.query(async () => {
        return await db.puppy.findMany();
      }),
      deletePuppy: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.puppy.delete({
        where: { id: input.id },
      });
    }),
    getPuppyById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      // Fetch puppy details from database
      const puppy = await db.puppy.findUnique({
        where: { id: input.id },
      });

      if (!puppy) {
        throw new Error("Puppy not found");
      }
      return {
        ...puppy
      };
    })
  });
