"use client";

import { useState } from "react";
import { Calendar } from "~/components/ui/calendar";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface AppointmentDetailsProps {
  onSelectAppointment: (date: string, time: string) => void;
  onNext: () => void;
  title: string; // Title prop for reusability
  details: string; // details prop for reusability
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ onSelectAppointment, onNext, title, details }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Fetch available dates
  const { data: availableDates = [] } = api.availability.getAvailableDates.useQuery<string[]>();

  // Get today's date string
  const todayString = new Date().toISOString().split("T")[0] as string;

  // Filter available dates to exclude past dates
  const validAvailableDates = availableDates.filter((date) => date >= todayString);

  // Fetch available times for the selected date
  const selectedDateString = selectedDate?.toISOString().split("T")[0] ?? null!;
  const { data: timeslotData } = api.availability.getAvailabilityByDate.useQuery(
    { date: selectedDateString ?? "" },
    { enabled: !!selectedDateString }
  );

  // Extract available timeslots
  const timeslots = timeslotData
    ? timeslotData.filter((slot) => slot.status === "available").map((slot) => slot.timeSlot)
    : [];

  const morningSlots = timeslots.filter((time) => parseInt((time?.split(":")[0] ?? "0")) < 12);
  const afternoonSlots = timeslots.filter((time) => {
    const hour = parseInt((time?.split(":")[0] ?? "0"));
    return hour >= 12 && hour < 17;
  });
  const eveningSlots = timeslots.filter((time) => parseInt((time?.split(":")[0] ?? "0")) >= 17);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDateString) {
      onSelectAppointment(selectedDateString, time);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {/* Title */}
      <h3 className="text-lg font-bold text-[#344EAD]">{title}</h3>
      <p className="text-sm text-gray-500">
        {details}
      </p>

      {/* Layout */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-10">
        {/* Calendar Section */}
        <div className="flex-shrink-0">
          <h4 className="text-md font-semibold mb-2">Select Date</h4>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            className="bg-[#F2F7FF] border-hidden rounded-lg border max-w-[300px] text-center text-black"
            modifiers={{
              available: (date) =>
                validAvailableDates.includes(date.toISOString().split("T")[0] as string),
            }}
            modifiersClassNames={{
              selected: "!bg-[#133591] text-white rounded-full", // Circle for selected date
            }}
            components={{
              DayContent: ({ date }: { date: Date }) => {
                const isAvailable = validAvailableDates.includes(
                  date.toISOString().split("T")[0] as string
                );
                return (
                  <div className="flex flex-col items-center justify-center">
                    <span>{date.getDate()}</span>
                    {isAvailable && <span className="w-1 h-1 rounded-full bg-[#133591] mt-0.1"></span>}
                  </div>
                );
              },
              Caption: ({ displayMonth }) => (
                <div className="flex items-center justify-between px-4 py-2">
                  {/* Current Month and Year */}
                  <h3 className="text-custom-14 font-semibold text-gray-800">
                    {displayMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
            
                  {/* Navigation Arrows */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => {
                        const previousMonth = new Date(displayMonth);
                        previousMonth.setMonth(displayMonth.getMonth() - 1);
                        handleDateChange(previousMonth);
                      }}
                      className="text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>
            
                    {/* Next Button */}
                    <button
                      onClick={() => {
                        const nextMonth = new Date(displayMonth);
                        nextMonth.setMonth(displayMonth.getMonth() + 1);
                        handleDateChange(nextMonth);
                      }}
                      className="text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ),
            }}
          />
        </div>

        {/* Available Times Section */}
        <div className="flex-grow">
          <h4 className="text-md font-semibold mb-2">Available Times (PST)</h4>
          <div className="space-y-4">
            {/* Morning Slots */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700">Morning</h5>
              <div className="grid grid-cols-3 gap-4">
                {morningSlots.length > 0 ? (
                  morningSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => handleTimeSelect(time)}
                      className={`text-sm rounded-full w-[100px] border-[#B3B3B3] ${
                        selectedTime === time ? "bg-[#133591] text-white" : "bg-white text-[#444444]"
                      }`}
                    >
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No slots</p>
                )}
              </div>
            </div>

            {/* Afternoon Slots */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700">Afternoon</h5>
              <div className="grid grid-cols-3 gap-4">
                {afternoonSlots.length > 0 ? (
                  afternoonSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => handleTimeSelect(time)}
                      className={`text-sm rounded-full w-[100px] border-[#B3B3B3] ${
                        selectedTime === time ? "bg-[#133591] text-white" : "bg-white text-[#444444]"
                      }`}
                    >
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No slots</p>
                )}
              </div>
            </div>

            {/* Evening Slots */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700">Evening</h5>
              <div className="grid grid-cols-3 gap-4">
                {eveningSlots.length > 0 ? (
                  eveningSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => handleTimeSelect(time)}
                      className={`text-sm rounded-full w-[100px] border-[#B3B3B3] ${
                        selectedTime === time ? "bg-[#133591] text-white" : "bg-white text-[#444444]"
                      }`}
                    >
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No slots</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className={`px-6 py-2 rounded-full ${selectedDate && selectedTime ? "bg-blue-700 text-white" : "bg-gray-200"}`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AppointmentDetails;
