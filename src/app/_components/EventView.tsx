"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

const EventView: React.FC = () => {
  const { data: eventData, isLoading, isError } = api.event.getEventData.useQuery();
  const updateEventDateMutation = api.event.setEventDate.useMutation();

  const [date, setDate] = useState<string>(""); // Local state for date
  const [localIsEventActive, setLocalIsEventActive] = useState<boolean>(false); // Local state for event active status
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const getFormattedDate = (dateString: Date) => {
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return new Date(dateString).toLocaleString("en-CA", {
      timeZone: currentTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Effect to load event data from server
  useEffect(() => {
    if (eventData) {
      if (!date) {
        // Only set date and eventActive if they haven't been modified locally
        setDate(getFormattedDate(eventData.date));
        setLocalIsEventActive(eventData.isEventActive);
      }
    }
  }, [eventData, date]);

  // Effect to calculate time remaining
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (localIsEventActive && date) {
      interval = setInterval(() => {
        const eventTime = new Date(date).getTime();
        const currentTime = Date.now();
        const timeDiff = eventTime - currentTime;

        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          alert("Date set for countdown has already passed!")
          setTimeRemaining("");
          clearInterval(interval); // Clear the timer once the time has passed
        }
      }, 1000);
    }

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [localIsEventActive, date]);

  // Handle submission of form to update server with new values
  const handleSubmit = async () => {
    try {
      const updatedDate = new Date(date);
      setLocalIsEventActive(!localIsEventActive);
      await updateEventDateMutation.mutateAsync({
        date: updatedDate,
        isEventActive: localIsEventActive,
      });
      console.log("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (isLoading) return <p>Loading event data...</p>;
  if (isError) return <p>Error fetching event data</p>;

  return (
    <div className="mx-12">
      {localIsEventActive && timeRemaining && (
        <div className="w-full h-96 py-12 bg-gray-100 flex flex-col justify-center items-center">
          <h1>New Litter Coming Soon!</h1>
          <p className="text-xl">{timeRemaining}</p>
        </div>
      )}
      <div className="mt-5 flex flex-row">
        <label>
          Event Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block border rounded p-4 mx-2"
          />
        </label>
        
        <button className="p-2 text-sm bg-green-600 text-white rounded" onClick={handleSubmit}>
          {localIsEventActive ? 'Clear Event' : 'Start count down'}
        </button>
      </div>
    </div>
  );
};

export default EventView;
