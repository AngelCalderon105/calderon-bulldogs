"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

const AppointmentConfirmation: React.FC = () => {
  const searchParams = useSearchParams();
  
  // Retrieve the query parameters
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const type = searchParams.get("type");

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Appointment Confirmation</h1>
      
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded">
        <h2 className="text-lg font-semibold text-blue-500 mb-2">Appointment Details</h2>
        
        <div className="mb-4">
          <p className="text-gray-700">
            <strong>Date:</strong> {date || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Time:</strong> {time || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Appointment Type:</strong> {type || "N/A"}
          </p>
        </div>
        
        {/* Placeholder for any additional details or instructions */}
        <h3 className="text-lg font-semibold mb-2">Directions/Instructions</h3>
        <p className="text-gray-600">
          Please wait for a phone call from the owner with further instructions regarding your appointment.
        </p>

        {/* Option to go back to appointments page or home */}
        <div className="mt-6 flex justify-end">
          <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded shadow-md">
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
