"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import GalleryView from "~/app/_components/GalleryView";
import HowItWorks from "~/app/_components/Howitworks";
import WhiteButton from "~/app/_components/WhiteButton";
import BlueButton from "~/app/_components/BlueButton";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import ParentsComponent from "~/app/_components/ParentsComponent"
import ProfileGallery from "~/app/_components/ProfileGallery";
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
    <div className="mx-6 my-10">
      
      {puppy ? (
        <> 
        <div className="grid  grid-cols-10 gap-x-9 grid-rows-3">
        <div className="col-span-6 row-span-2  ">

        <ProfileGallery
          galleryType="puppy_galleries"
          galleryName={(puppy.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery"}
          />
          </div>
          <div className="flex flex-col gap-4 col-span-4 row-span-2 bg-light_blue rounded-xl p-7">
          
              <p className="text-4xl font-bold">Meet {puppy.name}!</p>
          <p>Birthdate: {new Date(puppy.birthdate).toLocaleDateString()}</p>
              <div className=" flex flex-row gap-11 ">
              <p className="">Personality</p>
              <div>

              {puppy.personality.map((item)=>(
                <WhiteButton text = {item}/>
              ))
            }
            </div>
            </div>
                <p>Breed: {puppy.breed}</p>
            <p>Color Variation: {puppy.color}</p>
            <p>Date Available: {new Date(puppy.dateAvailable).toLocaleDateString()}</p>
            <div className="bg-white p-6 ">
              <h1 className="font-bold text-font_light_blue">Pricing Details</h1>
              <p className=" text-secondary_grey">Purchase: ${puppy.price}</p>
              <p  className=" text-secondary_grey">Reserve: $500</p>

            </div>
            <div className="grid grid-cols-2 rows-2 gap-8 py-4  text-center  md:text-[16px] xl:text-[18px]">
              <div className="  place-self-center w-full ">
              <button className=" font-bold py-2  md:py-3 w-full rounded-full font-sans text-secondary_grey border-2 border-solid  bg-white">
                        Reserve Puppy
                    </button>

              </div>
              <div className=" place-self-center w-full ">
              <button className=" font-bold py-2  md:py-3 w-full rounded-full font-sans text-white bg-designblue">
                        Meet & Greet
                    </button>
              </div>
              <div className="col-span-2"> 
              <button className=" font-bold py-2  md:py-3 w-full rounded-full font-sans bg-gradient-to-r from-[#FFF5E3] to-[#F8CF91] text-buttonblue">
                        Purchase Puppy
                    </button>
              </div>
            </div>
            <p className="text-center">Cash payments accepted. Please contact us directly.</p>
          </div>
          <div className="py-8 col-span-6">
            <p className="text-4xl font-bold py-4">About {puppy.name}</p>
            <p>{puppy.description}</p>
          
          </div>
          </div>
          <HowItWorks />
          <ParentsComponent/>
  
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
