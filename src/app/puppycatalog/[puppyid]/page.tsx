"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import GalleryView from "~/app/_components/GalleryView";
import HowItWorks from "~/app/_components/Howitworks";
import WhiteButton from "~/app/_components/WhiteButton";
import BlueButton from "~/app/_components/BlueButton";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import ParentsComponent from "~/app/_components/ParentsComponent"
import { PuppyAttributesGrid } from "~/app/_components/PuppyAttibutesGrid";
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
    <div className="m-5 lg:m-10">
      
      {puppy ? (
        <> 
        <p className="md:hidden text-4xl font-bold col-span-4 text-center">Meet {puppy.name}!</p>
        {/* Start of Main Grid */}
        <div className="grid grid-cols-10 md:gap-x-2 xl:gap-x-20 ">
        <div className="col-span-10  lg:col-span-6">

        <ProfileGallery
          galleryType="puppy_galleries"
          galleryName={(puppy.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery"}
          />
          </div>
          {/* Start o Side Grid */}
          <div className="grid grid-cols-4 gap-4 col-span-10  lg:col-span-4 md:row-span-2 gap-y-6 md:gap-y-4 bg-light_blue rounded-xl p-7 md:text-sm lg:text-lg">
          
              <p className="text-4xl font-bold col-span-4 hidden md:block">Meet {puppy.name}!</p>
              <div className="col-span-4 flex gap-6">

              <div className="flex justify-start gap-3 text-lg items-center">
                  <img src="/birthdayCake.svg" alt="" className="w-7 h-7 lg:h-10 lg:w-10" />
            {(() => {
              const birthDate = new Date(puppy.birthdate);
              const today = new Date();
              
              const diffInDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
              
              
              if (diffInDays < 7) {
                return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} `; // Less than 7 days
              } else if (diffInDays < 28) {
                const weeks = Math.floor(diffInDays / 7);
                return `${weeks} week${weeks !== 1 ? "s" : ""} `; // 1 to 4 weeks
              } else {
                const months = Math.floor(diffInDays / 30); // Approximate 1 month = 30 days
                if (months === 0) {
                  return `1 month old`; // Prevent "0 months old"
                }
                return `${months} month${months !== 1 ? "s" : ""} `; // 1 month or more
              }
              
            })(
              
            ) 
          }
              </div>
              <div className="flex justify-start gap-2 text-lg items-center" >
                <img src="/sex.svg" alt="" className="w-7 h-7 lg:h-10 lg:w-10" />
                <span>{puppy.sex}</span>
              </div>
                    </div>
              <p className=" font-semibold text-dark_grey col-span-2">Personality</p>
              <div className=" flex flex-row col-span-2">
                  <div>

                  {puppy.personality.map((item)=>(
                    <WhiteButton text = {item} />
                  ))
                }
                </div>
            </div>
            <p className="col-span-2 font-semibold text-dark_grey ">Breed: </p>
            <p  className="col-span-2"> {puppy.breed}</p>
            <p className="col-span-2 font-semibold text-dark_grey">Color Variation:</p>
            <p className="col-span-2 ">{puppy.color}</p>
            <p className="col-span-2 font-semibold text-dark_grey">Date Available:</p>
            <p className="col-span-2"> {new Date(puppy.dateAvailable).toLocaleDateString()}</p>
            <div className="bg-white p-6 col-span-4 ">
              <h1 className="font-bold text-font_light_blue">Pricing Details</h1>
              <div className=" flex justify-between  font-semibold">
              <p className=" text-secondary_grey ">Purchase:</p>
              <p className=" text-dark_blue">${puppy.price}</p>
              </div>  
              <div className=" flex justify-between  font-semibold">
              <p className=" text-secondary_grey">Reserve: </p>
              <p className=" text-dark_blue">$500</p>
              </div>  

            </div>
           
              <button className="text-sm col-span-2 font-bold py-2  md:py-3 w-full rounded-full font-sans text-secondary_grey border-2 border-solid  bg-white">
                  Reserve Puppy
              </button>
              <button className=" text-sm col-span-2 font-bold py-2  md:py-3 w-full rounded-full font-sans text-white bg-designblue">
                  Meet & Greet
              </button>
              <button className=" col-span-4 font-bold py-2  md:py-3 w-full rounded-full font-sans bg-gradient-to-r from-[#FFF5E3] to-[#F8CF91] text-buttonblue">
                  Purchase Puppy
               </button>
            <p className="text-center col-span-4">Cash payments accepted. Please contact us directly.</p>
          </div>
          <div className="col-span-10 md:col-span-4 lg:col-span-6 py-4">
            <p className="text-4xl font-bold py-4">About {puppy.name}</p>
            <p>{puppy.description}</p>
          
          </div>
          </div>
          <p className="text-3xl font-bold py-4 mt-10 lg:mt-20 mb-6 ">What to know about {puppy.name}</p>
          <PuppyAttributesGrid />
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
