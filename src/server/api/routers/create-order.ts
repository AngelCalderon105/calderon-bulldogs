// server/api/routers/paypal.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import paypal from "@paypal/checkout-server-sdk";

const clientId = process.env.PAYPAL_CLIENT_ID || "";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export const paypalRouter = createTRPCRouter({
  createOrder: publicProcedure
    .input(
      z.object({
        amount: z.number(), // Amount to be paid
      })
    )
    .mutation(async ({ input }) => {
      // Create a new PayPal order
      let request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: input.amount, 
            },
          },
        ],
      });

      try {
        const response = await client.execute(request);
        return {
          id: response.result.id, 
        };
      } catch (error) {
        console.error("Error creating PayPal order:", error);
        throw new Error("Error creating PayPal order");
      }
    }),
});
