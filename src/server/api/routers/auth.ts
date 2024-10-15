// src/server/api/routers/auth.ts
import { z } from 'zod';
import { createTRPCRouter, t } from '~/server/api/trpc';
import { requestPasswordReset, resetPassword } from '~/server/auth';

export const authRouter = createTRPCRouter({
  requestPasswordReset: t.procedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      await requestPasswordReset(input.email);
    }),

  resetPassword: t.procedure
    .input(z.object({
      token: z.string(),
      newPassword: z.string().min(8),
    }))
    .mutation(async ({ input }) => {
      await resetPassword(input.token, input.newPassword);
    }),
});

