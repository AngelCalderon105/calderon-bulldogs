import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "~/server/db";

export const contactRouter = createTRPCRouter({
  createForm: publicProcedure
    .input(
      z.object({
        email: z.string(),
        phone: z.number(),
        type: z.enum(["GENERAL", "STUD", "PURCHASE"]),
        body: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newForm = await db.contactForm.create({
        data: {
          email: input.email,
          phone: input.phone,
          type: input.type,
          body: input.body,
        },
      });
      return newForm;
    }),

  listAllForms: publicProcedure.query(async () => {
    const forms = await db.contactForm.findMany();
    return forms;
  }),
});

// export const faqsRouter = createTRPCRouter({
//     createNewFaq: publicProcedure
//         .input(z.object({
//             question: z.string(),
//             answer: z.string()
//         }))
//         .mutation(async ({input}) => {
//             const newFaq = await db.faqs.create({
//                 data: {
//                     question: input.question,
//                     answer: input.answer,
//                 },
//             });
//             return newFaq;
//         }),

//     listAllFaqs: publicProcedure.query(async () => {
//         const faqs = await db.faqs.findMany();
//         return faqs;
//     }),

//     deleteFaq: publicProcedure
//         .input(z.object({
//             id: z.string(),
//         }))
//         .mutation(async ({input}) => {
//             const faq = await db.faqs.delete({
//                 where: {id: input.id}
//             });

//             return {success: true};
//         }),

//     updateFaq: publicProcedure
//         .input(z.object({
//             id:z.string(),
//             question: z.string(),
//             answer:z.string(),
//         }))
//         .mutation(async ({input}) => {
//             const faq = await db.faqs.update({
//                 where: {id: input.id},
//                 data: {
//                     question: input.question,
//                     answer: input.answer
//                 }
//             });
//             return faq;
//         })

// })
