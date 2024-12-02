import { eachDayOfInterval, format, startOfDay, endOfDay } from "date-fns";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

// Helper function to generate hourly slots with adminId included, ensuring UTC
const generateHourlySlots = (date: Date, startTime: number, endTime: number, adminId: string) => {
  const slots = [];
  for (let hour = startTime; hour < endTime; hour++) {
    const slotDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour));
    slots.push({
      date: slotDate,
      timeSlot: `${hour.toString().padStart(2, "0")}:00`,
      status: "available",
      adminId,
    });
  }
  return slots;
};

export const availabilityRouter = createTRPCRouter({
  generateAvailabilitySlots: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
        startTime: z.number().min(0).max(23).default(11),
        endTime: z.number().min(1).max(24).default(20),
        daysOff: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("Unauthorized");
      }

      const adminId = ctx.session.user.id;
      const { startDate, endDate, startTime, endTime, daysOff } = input;

      const start = new Date(Date.UTC(new Date(startDate).getUTCFullYear(), new Date(startDate).getUTCMonth(), new Date(startDate).getUTCDate()));
      const end = new Date(Date.UTC(new Date(endDate).getUTCFullYear(), new Date(endDate).getUTCMonth(), new Date(endDate).getUTCDate()));

      const days = eachDayOfInterval({ start, end });
      const allSlots = [];

      for (const day of days) {
        // Format day to day name in UTC
        const dayName = format(day, "EEEE") as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

        if (daysOff?.includes(dayName)) continue;


        const slots = generateHourlySlots(day, startTime, endTime, adminId);
        allSlots.push(...slots);
      }

      await prisma.availability.createMany({
        data: allSlots,
        skipDuplicates: true,
      });

      return { success: true, message: "Slots generated successfully." };
    }),

    getAvailableDates: publicProcedure.query(async ({ ctx }) => {
      const availabilityData = await prisma.availability.findMany({
        where: { status: "available" },
        distinct: ["date"],
        select: { date: true },
      });
    
      const availableDates: string[] = availabilityData.map((entry) => {
        // Convert the date to UTC and format only the date part (YYYY-MM-DD)
        const utcDate = new Date(Date.UTC(entry.date.getUTCFullYear(), entry.date.getUTCMonth(), entry.date.getUTCDate()));
        return utcDate.toISOString().split("T")[0] as string; // Extracts the date in YYYY-MM-DD format without time zone shift
      });
    
      return availableDates;
    }),
    

  getAvailabilityByDate: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const date = new Date(input.date);
      const start = startOfDay(date);
      const end = endOfDay(date);

      return await prisma.availability.findMany({
        where: {
          date: {
            gte: start,
            lte: end,
          },
          status: "available",
        },
        orderBy: { timeSlot: "asc" },
      });
    }),

  bookSlot: publicProcedure
    .input(
      z.object({
        date: z.string(),
        timeSlot: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { date, timeSlot } = input;
      const bookingDate = new Date(date);

      const startOfDayDate = startOfDay(bookingDate);
      const endOfDayDate = endOfDay(bookingDate);

      const slot = await prisma.availability.findFirst({
        where: {
          date: {
            gte: startOfDayDate,
            lte: endOfDayDate,
          },
          timeSlot,
          status: "available",
        },
      });

      if (!slot) {
        throw new Error("Slot is not available or already booked.");
      }

      await prisma.availability.update({
        where: {
          id: slot.id,
        },
        data: {
          status: "booked",
        },
      });

      return { success: true, message: "Slot booked successfully." };
    }),
});
