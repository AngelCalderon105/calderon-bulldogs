"use client";
import { api } from "~/trpc/react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";


interface PaymentOptionsProps {
  title: string;
  description: string;
  puppyid: number ;
  puppyPrice : number | undefined;
  onPaymentSuccess: (transactionDetails: { transactionID: string }) => void; // Callback after successful payment
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ title, description, onPaymentSuccess, puppyid, puppyPrice }:PaymentOptionsProps) => {
      const { data: puppy, isLoading, error } = api.puppyProfile.getPuppyById.useQuery({ id: puppyid });
      const createTransactionMutation = api.transaction.createTransaction.useMutation();
      const createOrderMutation = api.order.createOrder.useMutation();
      const captureOrderMutation = api.order.captureOrder.useMutation();

      const updatePuppyStatus = api.puppyProfile.updatePuppyStatus.useMutation();
      if (isLoading) {
        return <div>Loading...</div>; // Show a loading state while the data is being fetched
      }
    
      if (error || !puppy) {
        return <div>Error loading puppy data. Please try again later.</div>; // Handle errors
      }
    
  
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
  };
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  


  return (
    <PayPalScriptProvider options={initialOptions}>
    <div className="bg-white p-6 rounded-lg space-y-6">
      {/* Title and Description */}
      <h3 className="text-lg font-bold text-[#344EAD]">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>

            <div style={{ marginTop: "20px" }}>
              <h2>Purchase this puppy</h2>
              <PayPalButtons
                createOrder={async () => {
                  try {
                    // Create the order in the backend
                    const data = await createOrderMutation.mutateAsync({
                      amount: puppyPrice || (() => { throw new Error("Could not Find Price."); })(),
                      puppyName: puppy.name, 
                    });
                    return data.id; 
                  } catch (error) {
                    console.error("Error creating order:", error);
                    setPaymentStatus("Error creating order. Please try again.");
                    throw error;
                  }
                }}
                onApprove={async (data, actions) => {
                  try {
                    const result = await captureOrderMutation.mutateAsync({ orderId: data.orderID });
                      const transactionId = result.purchase_units[0].payments.captures[0].id;

                    setPaymentStatus("Payment successful. Thank you for your purchase!");
                    onPaymentSuccess({ transactionID: transactionId || ""});
                  } catch (error) {
                    console.error("Error during onApprove:", error);
                    setPaymentStatus("Payment successful, but there was an issue processing the order.");
                  }
                }}
                
                onError={() => {
                  setPaymentStatus("Payment failed. Please try again or contact support.");
                }}
              />
            </div>
      </div>

 
  </PayPalScriptProvider>
  );
};

export default PaymentOptions;
