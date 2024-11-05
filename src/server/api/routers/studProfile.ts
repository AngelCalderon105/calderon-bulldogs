import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { db } from "~/server/db";

export const studProfileRouter = createTRPCRouter({
  createStud: publicProcedure
    .input(z.object({
      name: z.string(),
      birthdate: z.string(),
      breed: z.string(),
      color: z.string(),
      status: z.string(),
      price: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { name, birthdate, breed, color, status, price } = input;
      const newStud = await db.stud.create({
        data: {
          name,
          birthdate: new Date(birthdate), // Convert string to Date
          breed,
          color,
          status,
          price,
        },
      });
      return newStud;
    }),
    
  listStuds: publicProcedure.query(async () => {
    return await db.stud.findMany();
  }),
  
  deleteStud: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.stud.delete({
        where: { id: input.id },
      });
    }),
  
  getStudById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      // Fetch stud details from the database
      const stud = await db.stud.findUnique({
        where: { id: input.id },
      });

      if (!stud) {
        throw new Error("Stud not found");
      }
      return stud;
    })
});
