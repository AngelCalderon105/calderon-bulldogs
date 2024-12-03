"use client";
import React, { useState } from "react";
import PersonalInfo from "~/app/_components/PersonalInfo";
import AppointmentDetails from "~/app/_components/AppointmentDetails";
import PaymentOptions from "~/app/_components/PaymentOptions";
import { api } from "~/trpc/react";
import SuccessPage from "~/app/_components/Success";
import { format } from 'date-fns';

interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PuppyType {
  id: number;
  name: string | undefined;
  birthdate: Date;
  color: string;
  status: string;
  price: number;
}
interface AppointmentData {
  date: string;
  time: string;
}

interface PuppyPurchaseProps {
  params: { puppyid: string; type: string }; // Dynamic route params
}
export default function Checkout({ params }: PuppyPurchaseProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const puppyId = parseInt(params.puppyid, 10);
  const reservationMode = params.type === "reserve"; 
  const { data: puppy, isLoading, error } = api.puppyProfile.getPuppyById.useQuery({ id: puppyId });
  
  const puppyPrice = reservationMode ? 500 : puppy?.price;
  const formattedName = (puppy?.name ?? "").toLowerCase().replace(/\s+/g, "_") + "_gallery";
  
  
  const { data: photoData, isLoading: isPhotoLoading, error: photoError} = api.s3.getLatestPhoto.useQuery(
    { folder: "puppy_galleries", subfolder: formattedName },
    { enabled: !!formattedName } 
  );
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
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puppy data.</div>;

  // Safely access the photo
  const photo = photoData?.photo;
 const createTransactionMutation = api.transaction.createTransaction.useMutation();
 const createReservationMutation = api.transaction.createReservation.useMutation();
      const createOrderMutation = api.order.createOrder.useMutation();
      const updatePuppyStatus = api.puppyProfile.updatePuppyStatus.useMutation();

 
  // Error handling state

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
      // setOrderCompleted(true);
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
  const handlePaymentSuccess = async (transactionDetails: { orderId: string}) => {
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

  const handleSaveTransaction = async (paypalDetails: { transactionID: string }) => {
    try {
      await bookSlotAndCreateAppointment();
      const transactionDetails = {
        transactionId: paypalDetails.transactionID,
        customerName: `${personalInfoData.firstName} ${personalInfoData.lastName}`,
        customerEmail: personalInfoData.email,
        customerPhone: personalInfoData.phone,
        puppyId: puppy!.id, // Non-null assertion
        price: reservationMode ? 500 : puppy!.price, // Non-null assertion
        paymentType: reservationMode ? "Reservation" : "Purchase", 
      };

      if (reservationMode) {
        // Save reservation logic
        const reservedUntil = new Date();
        reservedUntil.setDate(reservedUntil.getDate() + 30); // Reserve for 30 days
        await createReservationMutation.mutateAsync({ ...transactionDetails, reservedUntil });
        await updatePuppyStatus.mutateAsync({ id: puppyId, status: "Reserved" });
      } else {
        // Save purchase logic
        await createTransactionMutation.mutateAsync(transactionDetails);
        await updatePuppyStatus.mutateAsync({ id: puppyId, status: "Sold" });
       }

      setOrderCompleted(true);
    } catch (error) {
      console.error("Error saving transaction:", error);
      setErrorMessage("An error occurred while processing the payment. Please try again.");
    }

  };

  
  const formatAppointmentDate = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}:00`);
    return format(date, "MMMM do, yyyy, h:mm a"); 
  };
  
  // Inside the component:
  const formattedDateTime =
    appointmentData?.date && appointmentData?.time
      ? formatAppointmentDate(appointmentData.date, appointmentData.time)
      : "Date not available";
  
  return (
    <div className="bg-[#F7F9FF] min-h-screen py-10 px-6">
      <div>
        <h1 className="text-4xl font-bold pb-10">{ reservationMode ? "Reservation" : "Purchase"}</h1></div>
      {orderCompleted ? (
        <SuccessPage
          orderSummary={{
            imageUrl: photo?.url ?? "Photo Not Available",
            name: puppy?.name,
            gender: puppy?.sex,
            age: "4 months old",
            total: puppyPrice,
            date: formattedDateTime,
            
            // cardDetails: "Mastercard ending 1234",
            // cardAddress: "12345, California, USA",
          }}
          contactInfo={{
            phone: "+1 (714) 232 9787",
            email: personalInfoData.email || "",
            locationImage: "/assets/map-image.png", // Replace with the map image path
          }}
        />
      ) : (
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">

          <PersonalInfo title="1. Personal Information" onNext={handlePersonalInfoNext} />
          {!reservationMode && 
          <>
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
          </> 
        }
          {showPayment ?(
           <PaymentOptions
           title="3. Payment Options"
           description="*Cash payments are accepted. To pay in cash contact us directly."
           onPaymentSuccess={handleSaveTransaction}
           puppyid={puppyId}
           puppyPrice  = {puppyPrice}
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
          <div>

          {isPhotoLoading ? (
            <div className=" w-full bg-gray-200 animate-pulse rounded-lg" />
          ) : photoError ?? !photo ? (
            <div className="w-full bg-gray-100 flex items-center justify-center text-gray-600 rounded-lg">
              No photo available
            </div>
          ) : (
            <img
            src={photo.url}
            alt={`${puppy?.name}'s latest photo`}
            className="w-full rounded-lg rounded-b-none h-72 object-cover"
            />
          )}
          </div>

          {/* Order Details */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <p>{ reservationMode ? "Reservation" : "Purchase"}</p>
            <p>
              <span className="font-semibold">{puppy?.name}</span> <br />
              {puppy?.sex}<br />
              {(() => {
              const birthDate = puppy?.birthdate ? new Date(puppy.birthdate) : new Date();

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
            </p>
            <div className="flex justify-between">
              <p>Total</p>
              <p className="font-bold text-lg">${puppyPrice}</p>
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
