"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import GalleryView from "~/app/_components/GalleryView";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

interface StudType {
  id: number;
  name: string;
  birthdate: Date;
  breed: string;
  color: string;
  status: string;
  price: number;
}

interface StudPurchaseProps {
  params: { studid: string };
}

export default function StudPurchase({ params }: StudPurchaseProps) {
  const studId = parseInt(params.studid, 10);
  const { data: stud, isLoading, error } = api.studProfile.getStudById.useQuery({ id: studId });

  // State to manage payment status messages
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // tRPC mutation for creating a transaction
  const createTransactionMutation = api.transaction.createTransaction.useMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stud data.</div>;

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
        <h1>Stud Profile</h1>
        {stud ? (
          <>
            <p>Name: {stud.name}</p>
            <p>Breed: {stud.breed}</p>
            <p>Color: {stud.color}</p>
            <p>Status: {stud.status}</p>
            <p>Price: ${stud.price}</p>
            <p>Birthdate: {new Date(stud.birthdate).toLocaleDateString()}</p>
            <GalleryView
              isAdmin={true}
              galleryType="stud_galleries"
              galleryName={(stud.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery"}
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
            <div style={{ marginTop: "20px" }}>
              <h2>Purchase this Stud</h2>
              <PayPalButtons
                onApprove={async (data, actions) => {
                  if (!customerName || !customerEmail || !customerPhone) {
                    setPaymentStatus("Please fill in your information before proceeding.");
                    return;
                  }
                  try {
                    // Mark the payment as successful
                    setPaymentStatus("Payment successful! Thank you for your purchase.");

                    // Save the transaction in the database
                    await createTransactionMutation.mutateAsync({
                      paypalCustomerId: data.payerID || "", // PayPal customer ID
                      transactionId: data.paymentID || "",
                      customerName: customerName,
                      customerEmail: customerEmail,
                      customerPhone: customerPhone,
                      studId: stud.id,
                    });

                    // If you need to capture the order manually, do it here
                    if (actions.order && actions.order.capture) {
                      await actions.order.capture();
                    }

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
          </>
        ) : (
          <p>Stud data not available.</p>
        )}
      </div>
    </PayPalScriptProvider>
  );
}
