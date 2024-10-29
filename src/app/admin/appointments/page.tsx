"use client";
import React, { useEffect, useState } from "react";

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
  status: "CONFIRMED" | "PENDING" | "CANCELED";
  createdAt: Date;
}

const AppointmentAdmin: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Mock data
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhoneNumber: "123-456-7890",
      appointmentType: "PUPPY",
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      status: "PENDING",
      createdAt: new Date(),
    },
    {
      id: "2",
      customerName: "Jane Smith",
      customerEmail: "jane.smith@example.com",
      customerPhoneNumber: "098-765-4321",
      appointmentType: "STUD",
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      status: "CONFIRMED",
      createdAt: new Date(),
    },
    {
      id: "3",
      customerName: "Alice Johnson",
      customerEmail: "alice.johnson@example.com",
      customerPhoneNumber: "555-555-5555",
      appointmentType: "GENERAL",
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      status: "CANCELED",
      createdAt: new Date(),
    },
  ];

  useEffect(() => {
    // Mock loading time
    setTimeout(() => {
      setAppointments(mockAppointments); // Set mock data
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleConfirm = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "CONFIRMED" } : app
      )
    );
  };

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "CANCELED" } : app
      )
    );
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
                {appointment.status === "PENDING" && (
                  <button
                    onClick={() => handleConfirm(appointment.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Confirm
                  </button>
                )}
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
