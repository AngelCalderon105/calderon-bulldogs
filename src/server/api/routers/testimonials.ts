import { createTRPCRouter, publicProcedure } from "../trpc";
import { string, z } from "zod";
import { db } from "~/server/db";

export const testimonialRouter = createTRPCRouter({
  createNewTestimonial: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        rating: z.enum([
          "ONE",
          "ONE_HALF",
          "TWO",
          "TWO_HALF",
          "THREE",
          "THREE_HALF",
          "FOUR",
          "FOUR_HALF",
          "FIVE",
        ]),
        comment: z.string(),
        published: z.boolean(),
        photoUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newTestimonial = await db.testimonial.create({
        data: {
          name: input.name,
          email: input.email,
          rating: input.rating,
          comment: input.comment,
          published: input.published,
          photoUrl: input.photoUrl,
        },
      });
      return newTestimonial;
    }),

  listAllTestimonials: publicProcedure.query(async () => {
    const testimonials = await db.testimonial.findMany();
    return testimonials;
  }),

  deleteTestimonial: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const testimonial = await db.testimonial.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  updateTestimonial: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        rating: z.enum([
          "ONE",
          "ONE_HALF",
          "TWO",
          "TWO_HALF",
          "THREE",
          "THREE_HALF",
          "FOUR",
          "FOUR_HALF",
          "FIVE",
        ]),
        comment: z.string(),
        photoUrl: z.string()
      }),
    )
    .mutation(async ({ input }) => {
      const testimonial = await db.testimonial.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          rating: input.rating,
          comment: input.comment,
          photoUrl: input.photoUrl
        },
      });
      return testimonial;
    }),
  
    configurePublished: publicProcedure
    .input(
      z.object({
        id: z.string(),
        published: z.boolean()
      }),
    )
    .mutation(async ({ input }) => {
      const testimonial = await db.testimonial.update({
        where: { id: input.id },
        data: {
          published: input.published,
        },
      });
      return testimonial;
    }),
});
