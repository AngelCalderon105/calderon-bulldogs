"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SuccessPageProps {
  orderSummary: {
    imageUrl: string;
    name: string;
    gender: string;
    age: string;
    total: number;
    date: string;
    time: string;
    cardDetails: string;
    cardAddress: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    locationImage: string;
  };
}

const SuccessPage: React.FC<SuccessPageProps> = ({ orderSummary, contactInfo }) => {
  const router = useRouter();

  return (
    <div className="bg-[#F7F9FF] min-h-screen py-10 px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <img
                src="/assets/CheckCircle.png" // Update with correct image path
                alt="Success Checkmark"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#344EAD]">Thank You For Your Purchase!</h1>
          <p>
            An email has been sent to{" "}
            <span className="font-semibold">{contactInfo.email}</span> with your complete purchase details.
          </p>
          <p className="text-sm text-gray-500">
            *A government issued ID will be required to pick up for safety concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Order Summary */}
          <div className="bg-[#F7F9FF] p-6 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="flex items-center space-x-4">
              <img
                src={orderSummary.imageUrl}
                alt="Puppy"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold">{orderSummary.name}</h3>
                <p>{orderSummary.gender}</p>
                <p>{orderSummary.age}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold">Order Total</p>
              <p className="text-xl font-bold">${orderSummary.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Pick Up Details</p>
              <p>
                {orderSummary.date} {orderSummary.time}
              </p>
            </div>
            <div>
              <p className="font-semibold">Payment Details</p>
              <p>{orderSummary.cardDetails}</p>
              <p>{orderSummary.cardAddress}</p>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-4">
            <div className="w-full h-[200px] rounded-lg overflow-hidden">
              <img
                src={contactInfo.locationImage}
                alt="Location Map"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm space-y-2">
              <h2 className="text-lg font-semibold">Contact Us</h2>
              <p>
                <a href={`tel:${contactInfo.phone}`} className="text-blue-600 hover:underline">
                  {contactInfo.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:underline">
                  {contactInfo.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
