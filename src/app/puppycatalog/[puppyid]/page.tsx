"use client";
import React, { useState } from "react";
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

    // State to manage payment status messages
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
  
    // tRPC mutation for creating a transaction
    const createTransactionMutation = api.transaction.createTransaction.useMutation();
    const createOrderMutation = api.order.createOrder.useMutation();
    const updatePuppyStatus = api.puppyProfile.updatePuppyStatus.useMutation();


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puppy data.</div>;

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      setPaymentStatus("Please fill in all fields.");
      return;
    }
    setPaymentStatus(null); // Clear any previous messages
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
            isAdmin={false}
            galleryType="puppy_galleries"
            galleryName={(puppy.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery"}
          />
  
          {/* Customer Information Form */}
          <form onSubmit={handleFormSubmit} style={{ marginTop: "20px" }}>
            <h2>Enter Your Information</h2>
            <label>
              Name:
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="block border rounded p-2 my-2"
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="block border rounded p-2 my-2"
                required
              />
            </label>
            <label>
              Phone:
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="block border rounded p-2 my-2"
                required
              />
            </label>
            <button type="submit" className="p-2 bg-blue-600 text-white rounded">
              Confirm Information
            </button>
          </form>
  
          {/* Payment Status Message */}
          {paymentStatus && (
            <div style={{ marginTop: "20px", color: paymentStatus.includes("successful") ? "green" : "red" }}>
              {paymentStatus}
            </div>
          )}
  
          {/* PayPal Buttons for Checkout */}
          {customerName && customerEmail && customerPhone && (
            <div style={{ marginTop: "20px" }}>
              <h2>Purchase this puppy</h2>
              <PayPalButtons
                createOrder={async () => {
                  try {
                    // Create the order in the backend
                    const data = await createOrderMutation.mutateAsync({
                      amount: puppy.price, // Pass the amount
                    });
                    return data.id; // Return PayPal order ID
                  } catch (error) {
                    console.error("Error creating order:", error);
                    setPaymentStatus("Error creating order. Please try again.");
                    throw error;
                  }
                }}
                onApprove={async (data, actions) => {
                  try {
                    setPaymentStatus("Payment successfulThank you for your purchase.");
                    await createTransactionMutation.mutateAsync({
                      paypalCustomerId: data.payerID || "", 
                      transactionId: data.orderID || "", 
                      customerName,
                      customerEmail,
                      customerPhone,
                      puppyId: puppy.id,
                      price: puppy.price,
                    });
                    await updatePuppyStatus.mutateAsync({
                      id: puppy.id, 
                      status: "Sold", 
                    });
                  } catch (error) {
                    console.error("Error saving transaction:", error);
                    setPaymentStatus("Payment successful, but there was an issue saving the transaction.");
                  }
                }}
                onError={() => {
                  setPaymentStatus("Payment failed. Please try again or contact support.");
                }}
              />
            </div>
          )}
        </>
      ) : (
        <p>Puppy data not available.</p>
      )}
    </div>
  </PayPalScriptProvider>
  
  );
}
