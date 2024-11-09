"use client";
import React, { useState } from "react";
import { trpc } from "~/utils/trpc"; // Adjust the path to your utils file
import { format, fromZonedTime, toZonedTime } from 'date-fns-tz';

const timeZone = 'America/Los_Angeles'; // PST

const AdminAvailability: React.FC = () => {
  const [weekday, setWeekday] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { data: availabilities, refetch } = trpc.availability.getAdminAvailability.useQuery();
  const createAvailability = trpc.availability.createAvailability.useMutation({
    onSuccess: () => {
      refetch(); // Refresh the list of availabilities after adding a new one
    },
  });
  const deleteAvailability = trpc.availability.deleteAvailability.useMutation({
    onSuccess: () => {
      refetch(); // Refresh the list after deletion
    },
  });

  const handleSubmit = () => {
    createAvailability.mutate({
      weekday,
      startTime,
      endTime,
    });
  };

  const handleDelete = (id: string) => {
    deleteAvailability.mutate({ id });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Availability</h1>
      <div className="mb-4">
        <label>
          Weekday:
          <input
            type="text"
            value={weekday}
            onChange={(e) => setWeekday(e.target.value)}
            className="border p-2"
          />
        </label>
      </div>
      <div className="mb-4">
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2"
          />
        </label>
      </div>
      <div className="mb-4">
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2"
          />
        </label>
      </div>
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
        Add Availability
      </button>

      <h2 className="mt-8 text-xl font-semibold">Current Availability</h2>
      <ul>
      {availabilities?.map((slot) => {
          const startTimeZoned = toZonedTime(new Date(slot.startTime), timeZone);
          const endTimeZoned = toZonedTime(new Date(slot.endTime), timeZone);
          const startTimeFormatted = format(startTimeZoned, 'hh:mm a');
          const endTimeFormatted = format(endTimeZoned, 'hh:mm a');

          return (
            <li key={slot.id} className="mb-2 flex justify-between items-center">
              <span>
                {slot.weekday}: {startTimeFormatted} - {endTimeFormatted}
              </span>
              <button onClick={() => handleDelete(slot.id)} className="bg-red-500 text-white p-1 rounded ml-4">
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminAvailability;
