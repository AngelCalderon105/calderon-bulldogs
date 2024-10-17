import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";

export const eventRouter = createTRPCRouter({
  getEventData: publicProcedure.query(async () => {
    // Get the most recent event row based on the event date
    const event = await db.event.findFirst({
      orderBy: { date: "desc" }, 
    });

    if (!event) {
      return { date: new Date(), isEventActive: false, showBanner: false };
    }

    // Check if the event is active and not expired
    if (event.isEventActive && new Date() > event.date) {
      // Delete the event if it's expired or inactive
      await db.event.delete({
        where: { id: event.id },
      });
      return { date: new Date(), isEventActive: false, showBanner: false };
    }

    return event; 
  }),

  setEventDate: publicProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.date(),
        isEventActive: z.boolean(),
        showBanner: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log("TRPC call - Processing request");

        const existingEvent = await db.event.findFirst({
          orderBy: { date: "desc" }, 
        });

        // Update or create an event if either isEventActive or showBanner is true
        if (input.isEventActive || input.showBanner) {
          console.log("Creating or updating event");

          if (existingEvent) {
            // If an event already exists, update it
            const updatedEvent = await db.event.update({
              where: { id: existingEvent.id },
              data: {
                name: input.name,
                date: input.date || new Date(),
                isEventActive: input.isEventActive,
                showBanner: input.showBanner,
              },
            });
            return updatedEvent;
          } else {
            // If no event exists, create a new one
            const newEvent = await db.event.create({
              data: {
                name: input.name,
                date: input.date || new Date(),
                isEventActive: input.isEventActive,
                showBanner: input.showBanner,
              },
            });
            return newEvent;
          }
        } else {
          console.log("Clearing the event");

          if (existingEvent) {
            await db.event.delete({
              where: { id: existingEvent.id },
            });
          }

          return { success: true, message: "Event cleared" };
        }
      } catch (error) {
        console.error("Error in TRPC call", error);
        return { success: false, error: "Failed to update event" };
      }
    }),
});
