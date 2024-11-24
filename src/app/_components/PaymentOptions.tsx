"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import PayPalIntegration from "./PayPalIntegration";

interface PaymentOptionsProps {
  title: string;
  description: string;
  price: number; // The total price
  onPaymentSuccess: (transactionDetails: { orderId: string; payerId: string }) => void; // Callback after successful payment
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ title, description, price, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg space-y-6">
      {/* Title and Description */}
      <h3 className="text-lg font-bold text-[#344EAD]">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>

      {/* Payment Method Selection */}
      <div className="flex gap-4">
        <Button
          variant={paymentMethod === "PayPal" ? "default" : "outline"}
          onClick={() => setPaymentMethod("PayPal")}
          className={`w-full py-2 ${
            paymentMethod === "PayPal" ? "bg-yellow-500 text-white" : ""
          }`}
        >
          PayPal
        </Button>
        <Button
          variant={paymentMethod === "Card" ? "default" : "outline"}
          onClick={() => setPaymentMethod("Card")}
          className={`w-full py-2 ${
            paymentMethod === "Card" ? "bg-black text-white" : ""
          }`}
        >
          Debit or Credit Card
        </Button>
      </div>

      {/* Payment Integration */}
      {paymentMethod === "PayPal" && (
        <PayPalIntegration
          amount={price}
          onSuccess={onPaymentSuccess}
          onError={(error) => console.error("PayPal Error:", error)}
        />
      )}
      {paymentMethod === "Card" && <p>Card Payment Integration Coming Soon!</p>}
    </div>
  );
};

export default PaymentOptions;
