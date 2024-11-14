"use client";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { AppointmentStatus } from "@prisma/client";
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
  status: AppointmentStatus;
  createdAt: Date;
}

const AppointmentAdmin: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isError, setIsError] = useState(false);

  // Fetch appointments using TRPC
  const { data, error, isLoading } = api.appointment.getAppointments.useQuery();

  useEffect(() => {
    if (data) {
      setAppointments(data);
    }
    if (error) {
      setIsError(true);
    }
  }, [data, error]);

  // Mutation to cancel an appointment
  const { mutateAsync: cancelAppointment } = api.appointment.cancelAppointment.useMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment({ id });
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: AppointmentStatus.CANCELED } : app
        )
      );
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      setIsError(true);
    }
  };
  

  if (isLoading) {
    return <p>Loading appointments...</p>;
  }

  if (isError) {
    return <p>Error loading appointments. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments available.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-6 rounded-lg shadow-md bg-white">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{appointment.customerName}</h2>
                <span
                  className={`px-3 py-1 rounded ${
                    appointment.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
              <p className="text-gray-600">{appointment.customerEmail}</p>
              <p className="text-gray-600">{appointment.customerPhoneNumber}</p>
              <p className="text-gray-500 mt-2">
                <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p className="text-gray-500">
                <strong>Time:</strong> {new Date(appointment.startTime).toLocaleTimeString()} -{" "}
                {new Date(appointment.endTime).toLocaleTimeString()}
              </p>
              <p className="text-gray-500">
                <strong>Type:</strong> {appointment.appointmentType}
              </p>

              <div className="flex space-x-4 mt-4">
                {appointment.status !== "CANCELED" && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentAdmin;
