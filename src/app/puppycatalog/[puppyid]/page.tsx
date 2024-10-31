"use client";
import React from "react";
import { api } from "~/trpc/react";
import GalleryView from "~/app/_components/GalleryView";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

interface PuppyType {
  id: number;
  name: string;
  birthdate: Date;
  color: string;
  status: string;
  price: number;
}

interface PuppyPurchaseProps {
  params: { puppyid: string };
}

export default function PuppyPurchase({ params }: PuppyPurchaseProps) {
  const puppyId = parseInt(params.puppyid, 10);
  const { data: puppy, isLoading, error } = api.puppyProfile.getPuppyById.useQuery({ id: puppyId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puppy data.</div>;

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
  };
  console.log("PayPal Client ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);


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

           {/* Standard PayPal Buttons for Checkout */}
           <div style={{ marginTop: "20px" }}>
              <h2>Purchase this Puppy</h2>
              <PayPalButtons />
            </div>

          </>
        ) : (
          <p>Puppy data not available.</p>
        )}
      </div>
    </PayPalScriptProvider>
  );
}
