import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';
import { prisma } from '~/server/db';
import { TRPCError } from '@trpc/server';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { format, startOfDay, endOfDay } from 'date-fns';

// Initialize the Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

// Check if the domain exists in your environment variables
const domain = process.env.MAILGUN_DOMAIN || '';

export const appointmentRouter = createTRPCRouter({
  createAppointment: publicProcedure
    .input(
      z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhoneNumber: z.string(),
        appointmentType: z.enum(['GENERAL', 'PUPPY', 'STUD']),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string().optional(),
        puppyId: z.number().optional(), // Optional puppyId for appointments involving a puppy
      })
    )
    .mutation(async ({ input }) => {
      const { customerName, customerEmail, customerPhoneNumber, appointmentType, date, startTime, endTime, puppyId } = input;

      if (!domain) {
        throw new Error('MAILGUN_DOMAIN is not set in environment variables.');
      }

      const startDateTime = new Date(`${date}T${startTime}:00`);
      if (isNaN(startDateTime.getTime())) {
        console.error('Received Start Time:', input.startTime);
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid start time format.' });
      }

      let endDateTime = endTime ? new Date(`${date}T${endTime}:00`) : new Date(startDateTime);
      if (!endTime) {
        endDateTime.setHours(endDateTime.getHours() + 1); // Default to a 1-hour appointment if endTime is not provided
      }

      if (isNaN(endDateTime.getTime())) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid end time format.' });
      }

      const now = new Date();
      const diff = (startDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diff < 24) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Appointments must be booked at least 24 hours in advance.' });
      }

      const overlappingAppointment = await prisma.appointment.findFirst({
        where: {
          date: new Date(date),
          startTime: startDateTime,
          endTime: endDateTime,
        },
      });

      if (overlappingAppointment) {
        throw new TRPCError({ code: 'CONFLICT', message: 'This time slot is already booked.' });
      }
      const formattedDetails = `Appointment on ${format(
        startDateTime,
        'MMMM do, yyyy'
      )} from ${format(startDateTime, 'h:mm a')} to ${format(endDateTime, 'h:mm a')}`;


      const newAppointment = await prisma.appointment.create({
        data: {
          customerName,
          customerEmail,
          customerPhoneNumber,
          appointmentType,
          date: new Date(date),
          startTime: startDateTime,
          endTime: endDateTime,
          puppyId: puppyId ?? null, 
          status: "PENDING",
          formattedDetails, // Explicitly set puppyId to null if undefined
        },
      });
      
      const customerEmailDetails = {
        from: `no-reply@${domain}`,
        to: customerEmail,
        subject: 'Calderon Bulldogs Appointment Confirmation',
        text: `Dear ${customerName}, your appointment has been confirmed for ${startDateTime.toDateString()} from ${startTime} to ${format(
          endDateTime,
          'h:mm a'
        )} for ${appointmentType}.`,
        html: `<p>Dear ${customerName},</p>
               <p>Your appointment has been confirmed with the following details:</p>
               <ul>
                 <li>Date: ${startDateTime.toDateString()}</li>
                 <li>Time: ${format(startDateTime, 'h:mm a')} - ${format(endDateTime, 'h:mm a')}</li>
                 
               </ul>
               <p>Thank you for scheduling your appointment!</p>
               <p>- Calderon Bulldogs</p>
               `,
      };

      const adminEmailDetails = {
        from: `no-reply@${domain}`,
        to: 'angelcalderon105@gmail.com', // Hardcoded admin email
        subject: 'New Appointment Scheduled',
        text: `New appointment scheduled by ${customerName}. Contact: ${customerPhoneNumber}.`,
        html: `<h2>New Appointment Scheduled</h2>
               <p>Customer Name: ${customerName}</p>
               <p>Contact: ${customerPhoneNumber}</p>
               <p>Email: ${customerEmail}</p>
               <p>Date: ${startDateTime.toDateString()}</p>
                 <li>Time: ${format(startDateTime, 'h:mm a')} - ${format(endDateTime, 'h:mm a')}</li>
               <p>Type: ${appointmentType}</p>`,
      };

      try {
        await mg.messages.create(domain, customerEmailDetails);
        console.log(`Confirmation email sent to ${customerEmail}`);

        await mg.messages.create(domain, adminEmailDetails);
        console.log('Admin notification email sent');
      } catch (error) {
        console.error('Failed to send email:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to send email notifications.' });
      }

      return newAppointment;
    }),

  getAppointments: protectedProcedure.query(async () => {
    return await prisma.appointment.findMany();
  }),

  getAppointmentsByDate: publicProcedure
    .input(
      z.object({
        date: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { date } = input;
      const start = startOfDay(new Date(date));
      const end = endOfDay(new Date(date));

      return await prisma.appointment.findMany({
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
      });
    }),

    cancelAppointment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.appointment.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),


});
