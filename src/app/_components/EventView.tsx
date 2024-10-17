"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface EventProps {
  isAdmin: boolean;
}

const EventView: React.FC<EventProps> = ({ isAdmin }) => {
  const { data: eventData, isLoading, isError } = api.event.getEventData.useQuery();
  const updateEventDateMutation = api.event.setEventDate.useMutation();

  const [date, setDate] = useState<string>(""); 
  const [localIsEventActive, setLocalIsEventActive] = useState<boolean>(false); 
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [showBanner, setShowBanner] = useState<boolean>(false); 

  // Convert the date to UTC and format it for consistency
  const getFormattedDate = (dateString: Date | string) => {
    const utcDate = new Date(dateString);
    return utcDate.toISOString().split("T")[0]; 
  };

  //Load event data from server
  useEffect(() => {
    if (eventData) {
      console.log("Fetched event data:", eventData); 

      if (eventData.date) {
        const formattedDate = getFormattedDate(eventData.date);
        setDate(formattedDate || ""); 
      } else {
        setDate(""); 
      }

      setLocalIsEventActive(eventData.isEventActive ?? false); 
      setShowBanner(eventData.showBanner ?? false); 
      console.log("Banner state set to:", eventData.showBanner); 
    }
  }, [eventData]);

  // Effect to calculate time remaining if event is active
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
          alert("Date set for countdown has already passed!");
          setTimeRemaining("");
          clearInterval(interval); // Clear the timer once the time has passed
        }
      }, 1000);
    }

    return () => clearInterval(interval); 
  }, [localIsEventActive, date]);

  const handleSubmit = async () => {
    if (!date) {
      alert("Please select a date before starting the countdown.");
      return;
    }

    const updatedDate = new Date(date); 

    // Check if the date is in the past before updating
    if (updatedDate < new Date()) {
      alert("Cannot set a countdown for a past date.");
      return;
    }

    try {
      await updateEventDateMutation.mutateAsync({
        name: "Event Countdown",
        date: updatedDate, 
        isEventActive: !localIsEventActive,
        showBanner: showBanner, 
      });
      setLocalIsEventActive(!localIsEventActive);
      console.log("Event updated successfully");
      alert("Event updated successfully!"); 
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleShowBanner = async (show: boolean) => {
    if (!date) {
      alert("Please select a date before updating the banner.");
      return;
    }

    try {
      console.log("Before call: showBanner value is", show);

      await updateEventDateMutation.mutateAsync({
        date: new Date(date), 
        name: "Event Countdown",
        isEventActive: localIsEventActive, 
        showBanner: show, // Set the banner visibility
      });

      console.log("After mutation call, updating state");

      // Update local state
      setShowBanner(show);

      console.log("Banner updated successfully");
      alert("Banner visibility updated!");
    } catch (error) {
      console.error("Error updating banner visibility:", error);
    }
  };

  if (isLoading) return <p>Loading event data...</p>;
  if (isError) return <p>Error fetching event data</p>;

  return (
    <div className="mx-12">
      {/* Display the banner if showBanner is true or event is active */}
      {(showBanner || localIsEventActive) && (
        <div className="w-full h-96 py-12 bg-gray-100 flex flex-col justify-center items-center">
          <h1>New Litter Coming Soon!</h1>
          {/* Only show the timer if the event is active and timeRemaining exists */}
          {localIsEventActive && timeRemaining && <p className="text-xl">{timeRemaining}</p>}
        </div>
      )}

      {/* Show the form only if the user is an admin */}
      {isAdmin && (
        <div className="mt-5 flex flex-row">
          <label>
            Event Date:
            <input
              type="date"
              value={date} // Use fallback in case date is empty
              onChange={(e) => setDate(e.target.value)}
              className="block border rounded p-4 mx-2"
            />
          </label>

          <label className="ml-4">
            <input
              type="checkbox"
              checked={showBanner}
              onChange={(e) => handleShowBanner(e.target.checked)}
              className="mr-2"
              disabled={localIsEventActive} // Disable checkbox if event is active
            />
            Show Banner
          </label>

          <button className="p-2 text-sm bg-green-600 text-white rounded" onClick={handleSubmit}>
            {localIsEventActive ? "Clear Event" : "Start Countdown"}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventView;