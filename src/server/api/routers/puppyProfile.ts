// server/api/trpc/puppyProfile.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "~/server/api/trpc";
import { db } from "~/server/db";

export const puppyProfileRouter = createTRPCRouter({
  createPuppy: publicProcedure
    .input(
      z.object({
        name: z.string(),
        birthdate: z.string(),
        dateAvailable: z.string(),
        color: z.string(),
        price: z.number(),
        breed: z.string(),
        sex: 
          z.enum([
            "Male",
            "Female",
            "Non_Specified"
          ])
        ,
        personality: z.array(
          z.enum([
            "calm",
            "shy",
            "happy",
            "lazy",
            "energetic",
            "playful",
            "curious",
            "intelligent",
            "friendly",
            "protective",

          ])
        ),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, birthdate, color, price, breed, personality, description, sex, dateAvailable } = input;
      const newPuppy = await db.puppy.create({
        data: {
          name,
          birthdate: new Date(birthdate), // Convert string to Date
          dateAvailable: new Date(birthdate),
          color,
          price,
          breed,
          sex,
          personality,
          description,
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
      const puppy = await db.puppy.findUnique({
        where: { id: input.id },
      });

      if (!puppy) {
        throw new Error("Puppy not found");
      }
      return puppy;
    }),

  updatePuppyStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["Available", "Reserved", "Sold"]),
      })
    )
    .mutation(async ({ input }) => {
      const updatedPuppy = await db.puppy.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      return updatedPuppy;
    }),

  updatePuppy: publicProcedure
  .input(
    z.object({
      id: z.number(),
      name: z.string().optional(),
      birthdate: z.string().optional(),
      dateAvailable: z.string().optional(),
      color: z.string().optional(),
      price: z.number().optional(),
      breed: z.string().optional(),
      personality: z
        .array(
          z.enum([
            "calm",
            "shy",
            "happy",
            "lazy",
            "energetic",
            "playful",
            "curious",
            "intelligent",
            "friendly",
            "protective",
          ])
        )
        .optional(),
      description: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { id, birthdate, dateAvailable, ...updateData } = input;

      if (birthdate) {
        birthdate: new Date(birthdate)
      }
      if (dateAvailable) {
        dateAvailable: new Date(dateAvailable)
      }
  

    // Perform the update
    const updatedPuppy = await db.puppy.update({
      where: { id },
      data: updateData,
    });

    return updatedPuppy;
  }),

});
