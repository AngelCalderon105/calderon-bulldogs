// server/api/routers/paypal.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import paypal from "@paypal/checkout-server-sdk";

const clientId = process.env.PAYPAL_CLIENT_ID || "";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export const paypalRouter = createTRPCRouter({
  createOrder: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        puppyName: z.string(),
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
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: input.amount,
                },
              },
            },
            items: [
              {
                name: input.puppyName, 
                description: `Purchase of puppy: ${input.puppyName}`, 
                unit_amount: {
                  currency_code: "USD",
                  value: input.amount,
                },
                quantity: "1",
              },
            ],
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
    captureOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Capture the PayPal order
      let request = new paypal.orders.OrdersCaptureRequest(input.orderId);
      request.requestBody({});

      try {
        const response = await client.execute(request);
        return response.result; // Return the capture result
      } catch (error) {
        console.error("Error capturing PayPal order:", error);
        throw new Error("Error capturing PayPal order");
      }
    }),
});
