"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import { api } from "~/trpc/react";

// Define a type for the options in the MultiSelect component
type DayOption = {
    label: string;
    value: string;
};

const daysOfWeek = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

const AdminSlotGenerator = () => {
  // Specify types for startDate and endDate as Date | null
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState(11); // Default start time
  const [endTime, setEndTime] = useState(20); // Default end time
  const [message, setMessage] = useState("");
  const [daysOff, setDaysOff] = useState<DayOption[]>([]); // Specify type for daysOff
  const { mutate: generateSlots } = api.availability.generateAvailabilitySlots.useMutation({
    onSuccess: () => {
      setMessage("Slots generated successfully!");
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  const handleGenerateSlots = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!startDate || !endDate) {
      setMessage("Please select both start and end dates.");
      return;
    }
  
    if (startTime >= endTime) {
      setMessage("End time must be later than start time.");
      return;
    }
  
    // Explicitly cast daysOff values as the specific union type array
    const formattedDaysOff = daysOff.map(day => day.value) as ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];

  
    // Convert dates to strings outside of the function call to ensure types
    const formattedStartDate = (startDate.toISOString().split("T")[0]) as string;
    const formattedEndDate = (endDate.toISOString().split("T")[0]) as string;
  
    generateSlots({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startTime,
      endTime,
      daysOff: formattedDaysOff,
    });
  };
  

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Generate Availability Slots</h2>

      <form onSubmit={handleGenerateSlots} className="space-y-4">
        <div>
          <label className="block mb-2">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Start Time (24-hour format):</label>
          <input
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(Number(e.target.value))}
            min="0"
            max="23"
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2">End Time (24-hour format):</label>
          <input
            type="number"
            value={endTime}
            onChange={(e) => setEndTime(Number(e.target.value))}
            min="1"
            max="24"
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Days Off:</label>
          <MultiSelect
            options={daysOfWeek}
            value={daysOff}
            onChange={setDaysOff}
            labelledBy="Select days off"
            className="border rounded p-2 w-full"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Generate Slots
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default AdminSlotGenerator;
