import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const timeZone = 'America/Los_Angeles'; // Define the local time zone (PST)

export const availabilityRouter = createTRPCRouter({
  createAvailability: protectedProcedure
    .input(
      z.object({
        weekday: z.string(),
        startTime: z.string(), // Expecting time as a string in the format 'HH:mm'
        endTime: z.string(),   // Expecting time as a string in the format 'HH:mm'
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Construct Date objects for input time in the local time zone
      const startDateTime = new Date(`1970-01-01T${input.startTime}:00`);
      const endDateTime = new Date(`1970-01-01T${input.endTime}:00`);

      // Convert local time to UTC for storage
      const startTimeUTC = fromZonedTime(startDateTime, timeZone);
      const endTimeUTC = fromZonedTime(endDateTime, timeZone);

      console.log("Converted startTime in UTC:", startTimeUTC);
      console.log("Converted endTime in UTC:", endTimeUTC);

      return await prisma.availability.create({
        data: {
          weekday: input.weekday,
          startTime: startTimeUTC,
          endTime: endTimeUTC,
          adminId: ctx.session.user.id,
        },
      });
    }),

  getAdminAvailability: protectedProcedure.query(async ({ ctx }) => {
    const availabilities = await prisma.availability.findMany({
      where: {
        adminId: ctx.session.user.id,
      },
    });
    console.log("Fetched availabilities:", availabilities);
    return availabilities;
  }),

  deleteAvailability: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      console.log("Deleting availability with ID:", input.id);
      await prisma.availability.delete({ where: { id: input.id } });
      return { success: true };
    }),
    getAvailableTimes: publicProcedure.query(async () => {
        return await prisma.availability.findMany();
      }),
});
