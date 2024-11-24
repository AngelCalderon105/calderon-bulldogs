"use client";

import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

interface PayPalIntegrationProps {
  amount: number; // The amount to be paid
  onSuccess: (details: { orderId: string; payerId: string }) => void; // Callback for successful payment
  onError?: (error: string) => void; // Optional callback for errors
}

const PayPalIntegration: React.FC<PayPalIntegrationProps> = ({ amount, onSuccess, onError }) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="mt-6">
        <PayPalButtons
          createOrder={async () => {
            try {
              // Create order payload
              const order = {
                purchase_units: [{ amount: { value: amount.toFixed(2) } }],
              };
              // Return the order ID to PayPal
              return (await (await fetch("/api/create-paypal-order", { // Replace with your API
                method: "POST",
                body: JSON.stringify(order),
              })).json()).id;
            } catch (error) {
              const errorMessage = "Error creating PayPal order. Please try again.";
              setPaymentStatus(errorMessage);
              onError?.(errorMessage);
              throw error;
            }
          }}
          onApprove={async (data) => {
            try {
              const details = {
                orderId: data.orderID || "",
                payerId: data.payerID || "",
              };
              setPaymentStatus("Payment successful. Thank you for your purchase!");
              onSuccess(details);
            } catch (error) {
              const errorMessage = "Error capturing PayPal payment. Please try again.";
              setPaymentStatus(errorMessage);
              onError?.(errorMessage);
            }
          }}
          onError={(error) => {
            const errorMessage = "Payment failed. Please try again.";
            setPaymentStatus(errorMessage);
            onError?.(errorMessage);
          }}
        />
        {paymentStatus && (
          <div className={`mt-4 ${paymentStatus.includes("successful") ? "text-green-600" : "text-red-600"}`}>
            {paymentStatus}
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalIntegration;
