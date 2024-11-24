"use client";
import React, { useState } from "react";
import PersonalInfo from "~/app/_components/PersonalInfo";
import AppointmentDetails from "~/app/_components/AppointmentDetails";
import PaymentOptions from "~/app/_components/PaymentOptions";
import { api } from "~/trpc/react";
import SuccessPage from "~/app/_components/Success";
interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AppointmentData {
  date: string;
  time: string;
}

const Checkout: React.FC = () => {
  const [showAppointment, setShowAppointment] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Error handling state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Define both mutations for booking a slot and creating an appointment
  const { mutateAsync: bookSlot } = api.availability.bookSlot.useMutation();
  const { mutateAsync: createAppointment } = api.appointment.createAppointment.useMutation();

  // Handle Personal Info submission
  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    setPersonalInfoData(data);
    setShowAppointment(true);
  };

  // Handle Appointment selection
  const handleAppointmentSelect = (date: string, time: string) => {
    setAppointmentData({ date, time });
  };

  const handleAppointmentNext = () => {
    if (appointmentData?.date && appointmentData?.time) {
      setShowPayment(true);
      setOrderCompleted(true);
    } else {
      alert("Please select an appointment date and time before proceeding.");
    }
  };

  // Logic to book a slot and create an appointment
  const bookSlotAndCreateAppointment = async () => {
    if (!appointmentData?.date || !appointmentData?.time) {
      throw new Error("Missing appointment details.");
    }

    // Book the slot
    await bookSlot({
      date: appointmentData.date,
      timeSlot: appointmentData.time,
    });

    // Create the appointment
    await createAppointment({
      customerName: `${personalInfoData.firstName} ${personalInfoData.lastName}`,
      customerEmail: personalInfoData.email,
      customerPhoneNumber: personalInfoData.phone,
      appointmentType: "PUPPY", // Replace with the appropriate type if dynamic
      date: appointmentData.date,
      startTime: appointmentData.time,
    });
  };

  // Handle payment success
  const handlePaymentSuccess = async (transactionDetails: { orderId: string; payerId: string }) => {
    console.log("Transaction Success:", transactionDetails);
    setErrorMessage(null);

    try {
      // Book the slot and create the appointment
      await bookSlotAndCreateAppointment();

      setOrderCompleted(true);
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      setErrorMessage(error.message || "Failed to book the appointment. Please try again.");
    }
  };


  return (
    <div className="bg-[#F7F9FF] min-h-screen py-10 px-6">
      {orderCompleted ? (
        <SuccessPage
          orderSummary={{
            imageUrl: "/assets/stud_service.png",
            name: "Maggie",
            gender: "Female",
            age: "4 months old",
            total: 3000,
            date: appointmentData?.date || "",
            time: appointmentData?.time || "",
            cardDetails: "Mastercard ending 1234",
            cardAddress: "12345, California, USA",
          }}
          contactInfo={{
            phone: "+1 (123) 456 7890",
            email: personalInfoData.email || "",
            locationImage: "/assets/map-image.png", // Replace with the map image path
          }}
        />
      ) : (
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">

          <PersonalInfo title="1. Personal Information" onNext={handlePersonalInfoNext} />
          {showAppointment ? (
            <AppointmentDetails
            title="2. Appointment Information"
            details="*A government issued ID will be required to pick up for safety concerns."
            onSelectAppointment={handleAppointmentSelect}
            onNext={handleAppointmentNext} // Pass the onNext prop
          />
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 text-gray-500">
              <h3 className="text-lg font-bold text-[#344EAD]">2. Pick Up Details</h3>
              <p>Once you have confirmed your personal information, select your pickup appointment.</p>
            </div>
          )}
          {showPayment ?(
            <PaymentOptions
              title="3. Payment Options"
              description="*Cash payments are accepted. To pay in cash contact us directly."
              price={3000} // Example price
              onPaymentSuccess={handlePaymentSuccess}
            />
          ): (
            <div className="bg-white shadow-md rounded-lg p-6 text-gray-500">
              <h3 className="text-lg font-bold text-[#344EAD]">3. Payment</h3>
              <p>*Cash payments are accepted. To pay in cash contact us directly.</p>
            </div>
          )}
          {orderCompleted && (
            <p className="text-green-600 font-semibold text-lg">
              Order Completed! Thank you for your purchase.
            </p>
          )}
        </div>

        {/* Right Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          {/* Puppy Image */}
          <div className="w-full h-[200px] overflow-hidden rounded-lg">
            <img
              src="/assets/stud_service.png" // Replace with actual image path
              alt="Puppy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Order Details */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <p>
              <span className="font-semibold">Maggie</span> <br />
              Female <br />
              4 months old
            </p>
            <div className="flex justify-between">
              <p>Total</p>
              <p className="font-bold text-lg">$3,000.00</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-sm text-gray-600">
            <p>
              Have any questions?{" "}
              <a href="/contact-us" className="text-blue-600 hover:underline">
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Checkout;
