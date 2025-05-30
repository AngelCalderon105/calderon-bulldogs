"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface EventProps {
  isAdmin: boolean;
}

const EventView: React.FC<EventProps> = ({ isAdmin }) => {
  const {
    data: eventData,
    isLoading,
    isError,
  } = api.event.getEventData.useQuery();
  const updateEventDateMutation = api.event.setEventDate.useMutation();

  const [date, setDate] = useState<string>("");
  const [localIsEventActive, setLocalIsEventActive] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [showBanner, setShowBanner] = useState<boolean>(false);

  const [parsedTime, setParsedTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
  });

  const getFormattedDate = (dateString: Date | string) => {
    const utcDate = new Date(dateString);
    return utcDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (eventData) {
      if (eventData.date) {
        const formattedDate = getFormattedDate(eventData.date);
        setDate(formattedDate || "");
      } else {
        setDate("");
      }

      setLocalIsEventActive(eventData.isEventActive ?? false);
      setShowBanner(eventData.showBanner ?? false);
    }
  }, [eventData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (localIsEventActive && date) {
      interval = setInterval(() => {
        const eventTime = new Date(date).getTime();
        const currentTime = Date.now();
        const timeDiff = eventTime - currentTime;

        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
          setParsedTime({
            days: String(days).padStart(2, "0"),
            hours: String(hours).padStart(2, "0"),
            minutes: String(minutes).padStart(2, "0"),
          });
        } else {
          alert("Date set for countdown has already passed!");
          setTimeRemaining("");
          clearInterval(interval);
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
      await updateEventDateMutation.mutateAsync({
        date: new Date(date),
        name: "Event Countdown",
        isEventActive: localIsEventActive,
        showBanner: show,
      });

      setShowBanner(show);
      alert("Banner visibility updated!");
    } catch (error) {
      console.error("Error updating banner visibility:", error);
    }
  };

  if (isLoading) return <p>Loading event data...</p>;
  if (isError) return <p>Error fetching event data</p>;

  return (
    <div className="bg-[#F2F7FF] pb-2">
      {(showBanner || localIsEventActive) && (
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-[#EAF4FF] pb-2 pt-2 md:flex-row md:gap-20 md:pt-6">
          <div className="flex gap-3 py-4 md:flex-col md:gap-0 md:py-0">
            <h1 className="whitespace-nowrap font-extrabold text-[#0F172A] sm:text-2xl">
              Exciting news!
            </h1>
            <p className="whitespace-nowrap font-medium text-[#0F172A] sm:text-xl">
              New litter coming soon
            </p>
          </div>
          {localIsEventActive && timeRemaining && (
            <div className="flex items-center gap-4 text-[#0F172A]">
              <div>
                <div className="flex flex-col items-center rounded-md bg-white px-3 py-2 shadow sm:px-6 sm:py-4">
                  <span className="font-bold md:text-2xl">
                    {parsedTime.days}
                  </span>
                </div>
                <div className="sm:text-md py-2 text-center text-sm">Days</div>
              </div>
              <span className="self-start pt-1 text-xl font-bold sm:pt-3 md:text-3xl">
                :
              </span>
              <div>
                <div className="flex flex-col items-center rounded-md bg-white px-3 py-2 shadow sm:px-6 sm:py-4">
                  <span className="font-bold md:text-2xl">
                    {parsedTime.hours}
                  </span>
                </div>
                <div className="sm:text-md py-2 text-center text-sm">Hours</div>
              </div>
              <span className="self-start pt-1 text-xl font-bold sm:pt-3 md:text-3xl">
                :
              </span>
              <div>
                <div className="flex flex-col items-center rounded-md bg-white px-3 py-2 shadow sm:px-6 sm:py-4">
                  <span className="font-bold md:text-2xl">
                    {parsedTime.minutes}
                  </span>
                </div>
                <div className="sm:text-md py-2 text-center text-sm">
                  Minutes
                </div>
              </div>
            </div>
          )}
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
              className="mx-2 block rounded border p-4"
            />
          </label>

          <label className="ml-4">
            <input
              type="checkbox"
              checked={showBanner}
              onChange={(e) => handleShowBanner(e.target.checked)}
              className="mr-2"
              disabled={localIsEventActive}
            />
            Show Banner
          </label>

          <button
            className="rounded bg-green-600 p-2 text-sm text-white"
            onClick={handleSubmit}
          >
            {localIsEventActive ? "Clear Event" : "Start Countdown"}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventView;
