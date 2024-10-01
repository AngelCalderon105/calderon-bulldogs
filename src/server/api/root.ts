import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { s3Router } from './routers/s3';
import { faqsRouter } from './routers/faqs';
import { puppyProfileRouter } from './routers/puppyProfile';


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    s3: s3Router, //  S3 router added
    faqs: faqsRouter, 
    puppyProfile: puppyProfileRouter
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
