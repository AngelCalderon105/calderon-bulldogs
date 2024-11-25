import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { s3Router } from "./routers/s3";
import { faqsRouter } from "./routers/faqs";
import { testimonialRouter } from "./routers/testimonials";
import { contactRouter } from "./routers/contact-form";
import { puppyProfileRouter } from './routers/puppyProfile';
import { adminRouter } from "./routers/admin";
import { authRouter } from './routers/auth'; 
import { eventRouter } from "./routers/event";
import { blogRouter} from './routers/blog';
import { transactionRouter } from "./routers/transaction";
import { paypalRouter } from "./routers/create-order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  s3: s3Router, //  S3 router added
  faqs: faqsRouter,
  testimonial: testimonialRouter,
  contact: contactRouter,
  admin: adminRouter,
  auth: authRouter,
  puppyProfile: puppyProfileRouter,
  event: eventRouter,
  blog : blogRouter,
  transaction :transactionRouter, 
  order : paypalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
