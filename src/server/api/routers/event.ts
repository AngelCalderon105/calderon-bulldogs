import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";

export const eventRouter = createTRPCRouter({
  getEventData: publicProcedure.query(async () => {
    const event = await db.event.findUnique({
      where: { id: 1 },
    });

    if (!event) {
      // Handle case when event doesn't exist; return a default object
      return { date: new Date(), isEventActive: false, showBanner:false  };
    }
    return event; // Return the entire event object (including date and isEventActive)
  }),

  setEventDate: publicProcedure
    .input(
      z.object({
        date: z.date(), 
        isEventActive: z.boolean(), 
        showBanner: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Update the event with the provided date and active status
        const event = await db.event.update({
          where: { id: 1 },
          data: {
            date: input.date || new Date(), // Set to current date if not provided
            isEventActive: input.isEventActive, 
            showBanner: input.showBanner,
          },
        });
        return event; 
      } catch (error) {console.log(error);
        return { success: false, error: "Failed to update event date" };
      }
    }),
});
