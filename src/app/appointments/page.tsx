"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const AppointmentPage: React.FC = () => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [puppyType, setPuppyType] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const availableTimes = [
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const puppyTypes = ["General", "Puppy", "Stud"];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContactInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !puppyType) {
      alert("Please select a date, time, and type of puppy.");
      return;
    }

    // Navigate to the confirmation page with details in the URL
    const formattedDate = selectedDate.toDateString();
    router.push(
      `/confirmation?date=${encodeURIComponent(
        formattedDate
      )}&time=${encodeURIComponent(selectedTime)}&type=${encodeURIComponent(
        puppyType
      )}`
    );
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Schedule an Appointment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div>
          <DayPicker
            selected={selectedDate}
            onSelect={handleDateSelect}
            mode="single"
            disabled={{ before: new Date() }}
          />
        </div>

        {/* Appointment Details and Available Times */}
        <div>
          <h2 className="font-semibold mb-2">Appointment Info</h2>
          <p className="text-sm text-gray-600 mb-4">
            This info will change depending on whether they want a specific
            breed, puppy, or general visit for puppies.
          </p>
          <h3 className="font-semibold mb-2">Available Times</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`px-4 py-2 border rounded ${
                  selectedTime === time
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Appointment Preview */}
          {selectedDate && selectedTime && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold">Appointment Details</h3>
              <p>Date: {selectedDate.toDateString()}</p>
              <p>Time: {selectedTime}</p>
              <p>Puppy Type: {puppyType}</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="font-semibold mb-2">Contact Information</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={contactInfo.name}
              onChange={handleContactInfoChange}
              className="p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={contactInfo.email}
              onChange={handleContactInfoChange}
              className="p-2 border rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={contactInfo.phone}
              onChange={handleContactInfoChange}
              className="p-2 border rounded"
            />
            <select
              value={puppyType || ""}
              onChange={(e) => setPuppyType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="" disabled>
                Select Appointment Type
              </option>
              {puppyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => {
                  setSelectedDate(undefined);
                  setSelectedTime(null);
                  setContactInfo({ name: "", email: "", phone: "" });
                  setPuppyType(null);
                }}
                className="px-4 py-2 border rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 border rounded bg-blue-600 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
