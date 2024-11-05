"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import GalleryView from "~/app/_components/GalleryView";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

interface PuppyPurchaseProps {
  params: { puppyid: string };
}

export default function PuppyPurchase({ params }: PuppyPurchaseProps) {
  const puppyId = parseInt(params.puppyid, 10);
  const { data: puppy, isLoading, error } = api.puppyProfile.getPuppyById.useQuery({ id: puppyId });

  // State to manage payment status messages
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puppy data.</div>;

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div>
        <h1>Puppy Profile</h1>
        {puppy ? (
          <>
            <p>Name: {puppy.name}</p>
            <p>Color: {puppy.color}</p>
            <p>Status: {puppy.status}</p>
            <p>Price: ${puppy.price}</p>
            <p>Birthdate: {new Date(puppy.birthdate).toLocaleDateString()}</p>
            <GalleryView
              isAdmin={true}
              galleryType="puppy_galleries"
              galleryName={(puppy.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery"}
            />

            {/* Payment Confirmation Message */}
            {paymentStatus && <div style={{ marginTop: "20px", color: paymentStatus.includes("success") ? "green" : "red" }}>{paymentStatus}</div>}

            {/* PayPal Buttons with Event Handlers */}
            <div style={{ marginTop: "20px" }}>
              <h2>Purchase this Puppy</h2>
              <PayPalButtons
              onApprove={async () => {
                try {
                  setPaymentStatus("Payment successful! Thank you for your purchase.");
                  
                  // Return a resolved promise to satisfy the expected return type
                  return Promise.resolve();
                } catch (error) {
                  setPaymentStatus("An error occurred while processing your payment.");
                }
              }}
              onError={() => {
                setPaymentStatus("Payment failed. Please try again or contact support.");
              }}
              />

            </div>
          </>
        ) : (
          <p>Puppy data not available.</p>
        )}
      </div>
    </PayPalScriptProvider>
  );
}
