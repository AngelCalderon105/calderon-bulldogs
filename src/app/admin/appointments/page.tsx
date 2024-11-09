"use client";
import React, { useEffect, useState } from "react";
import { trpc } from '~/utils/trpc'; // Adjust the path if necessary

// Define the type for the appointment
interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  appointmentType: "GENERAL" | "PUPPY" | "STUD";
  date: Date;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}

const AppointmentAdmin: React.FC = () => {
  const { data: appointment, isLoading, isError } = trpc.appointment.getAppointments.useQuery();

  if (isLoading) {
    return <p>Loading appointments...</p>;
  }

  if (isError) {
    return <p>Error loading appointments. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Appointments</h1>
      {appointment && appointment.length > 0 ? (
  <div className="space-y-4">
    {appointment.map((appt) => (
      appt ? ( // Check if appt is defined
        <div key={appt.id} className="p-6 rounded-lg shadow-md bg-white">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">{appt.customerName}</h2>
            {/* Add other JSX as needed */}
          </div>
        </div>
      ) : null // Handle the case where appt is undefined
    ))}
  </div>
) : (
  <p>No appointments available.</p>
)}

    </div>
  );
};

export default AppointmentAdmin;
