"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface EventProps {
  isAdmin: boolean;
}

const EventView: React.FC<EventProps> = ({ isAdmin }) => {
  const { data: eventData, isLoading, isError } = api.event.getEventData.useQuery();
  const updateEventDateMutation = api.event.setEventDate.useMutation();

  const [date, setDate] = useState<string>(""); // Local state for date
  const [localIsEventActive, setLocalIsEventActive] = useState<boolean>(false); // Local state for event active status
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [showBanner, setShowBanner] = useState<boolean>(false); // Local state for banner

  const getFormattedDate = (dateString: Date) => {
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return new Date(dateString).toLocaleString("en-CA", {
      timeZone: "currentTimezone",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Effect to load event data from server
  useEffect(() => {
    if (eventData) {
      if (!date) {
        setDate(getFormattedDate(eventData.date));
        setLocalIsEventActive(eventData.isEventActive);

        // Automatically set showBanner to true if the event is active
        if (eventData.isEventActive) {
          setShowBanner(true);
        } else {
          setShowBanner(eventData.showBanner); // Otherwise, load showBanner state from server
        }
      }
    }
  }, [eventData, date]);

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

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [localIsEventActive, date]);

  // Handle submission of form to update server with new values
  const handleSubmit = async () => {
    try {
      const updatedDate = new Date(date);
      await updateEventDateMutation.mutateAsync({
        date: updatedDate,
        isEventActive: !localIsEventActive,
        showBanner: showBanner, // Pass banner state to mutation
      });
      setLocalIsEventActive(!localIsEventActive);
      console.log("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleShowBanner = async (show: boolean) => {
      try{
        await updateEventDateMutation.mutateAsync({
          date: new Date(),
          isEventActive: localIsEventActive,
          showBanner: show,
        });
        setShowBanner(show);
        console.log("Event updated successfully");
      } catch (error) {
        console.error("Error updating event:", error);
      }
  }

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
      
      {isAdmin && (
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
            {localIsEventActive ? 'Clear Event' : 'Start count down'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventView;
