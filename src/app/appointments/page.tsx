"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { trpc } from "~/utils/trpc";
import { format, isBefore, startOfDay } from "date-fns";

interface Appointment {
  id: string;
  date: Date;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  appointmentType: 'GENERAL' | 'STUD' | 'PUPPY';
  startTime: Date;
  endTime: Date;
  userId: string | null;
  puppyId: number | null;
}

const AppointmentPage: React.FC = () => {
  const router = useRouter();
  const createAppointmentMutation = trpc.appointment.createAppointment.useMutation();
  const { data: availabilities } = trpc.availability.getAdminAvailability.useQuery();
  const getAppointmentsByDate = trpc.appointment.getAppointmentsByDate.useQuery;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [puppyType, setPuppyType] = useState<'GENERAL' | 'STUD' | 'PUPPY' | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [appointmentsForSelectedDate, setAppointmentsForSelectedDate] = useState<Appointment[]>([]);

  const availabilityMap = availabilities?.reduce((map, slot) => {
    if (!map[slot.weekday]) {
      map[slot.weekday] = [];
    }
    (map[slot.weekday] as { startTime: Date; endTime: Date }[]).push({
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
    });
    return map;
  }, {} as Record<string, { startTime: Date; endTime: Date }[]>);

  useEffect(() => {
    const fetchAppointmentsForDate = async (date: Date) => {
      try {
        const response = await getAppointmentsByDate({ date: date.toISOString() });
        if (response.data) {
          const formattedAppointments: Appointment[] = response.data.map((appt: Appointment) => ({
            ...appt,
            startTime: new Date(appt.startTime),
            endTime: new Date(appt.endTime),
          }));
          setAppointmentsForSelectedDate(formattedAppointments);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    if (selectedDate) {
      fetchAppointmentsForDate(selectedDate);
    }
  }, [selectedDate, getAppointmentsByDate]);

  useEffect(() => {
    if (availabilityMap && selectedDate) {
      const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
      const availabilityForDay = availabilityMap[dayOfWeek];

      if (availabilityForDay && availabilityForDay.length > 0) {
        const times: string[] = [];

        availabilityForDay.forEach(({ startTime, endTime }) => {
          const current = new Date(startTime);
          while (current <= endTime) {
            const isTimeAvailable = !appointmentsForSelectedDate.some(
              (appt) => current >= appt.startTime && current < appt.endTime
            );

            if (isTimeAvailable) {
              times.push(format(new Date(current), "h a"));
            }

            current.setHours(current.getHours() + 1);
          }
        });

        setAvailableTimes(times);
      } else {
        setAvailableTimes([]);
      }
    } else {
      setAvailableTimes([]);
    }
  }, [availabilityMap, selectedDate, appointmentsForSelectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    console.log('handleConfirm function triggered');
    if (!selectedDate || !selectedTime || !puppyType) {
      alert("Please select a date, time, and type of puppy.");
      return;
    }

    const formattedDate = new Date(selectedDate);
    const [timeHour, timePeriod] = selectedTime.split(' ');

    if (!timeHour || !timePeriod) {
      alert('Invalid time format.');
      return;
    }

    let hour = parseInt(timeHour, 10);
    let adjustedHour;
    if (timePeriod === 'PM' && hour !== 12) {
      adjustedHour = hour + 12;
    } else if (timePeriod === 'AM' && hour === 12) {
      adjustedHour = 0;
    } else {
      adjustedHour = hour;
    }

    if (adjustedHour === undefined) {
      alert('Failed to parse and adjust time.');
      return;
    }

    const startTime = new Date(formattedDate);
    startTime.setUTCHours(adjustedHour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setUTCHours(startTime.getUTCHours() + 1);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      alert('Invalid start time format.');
      return;
    }

    try {
      const response = await createAppointmentMutation.mutateAsync({
        customerName: contactInfo.name,
        customerEmail: contactInfo.email,
        customerPhoneNumber: contactInfo.phone,
        appointmentType: puppyType,
        date: formattedDate.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      console.log('Appointment created:', response);
      setAvailableTimes((prevTimes) => prevTimes.filter((time) => time !== selectedTime));
      alert('Appointment successfully created!');
    } catch (error) {
      alert('Failed to create appointment. Please try again.');
      console.error(error);
    }
  };

  const disabledDates = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const hasAvailability = availabilityMap && availabilityMap[dayOfWeek] && availabilityMap[dayOfWeek].length > 0;

    const now = new Date();
    const isPastDate = isBefore(date, startOfDay(now));

    const result = isPastDate || !hasAvailability;
    console.log(`Date: ${date.toDateString()}, Disabled: ${result}`);

    return result;
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Schedule an Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <DayPicker
            selected={selectedDate}
            onSelect={handleDateSelect}
            mode="single"
            disabled={disabledDates}
            modifiersClassNames={{
              disabled: "bg-gray-200 text-gray-500",
            }}
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Appointment Info</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select an available date and time for your appointment.
          </p>
          <h3 className="font-semibold mb-2">Available Times</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`px-4 py-2 border rounded ${
                    selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  {time}
                </button>
              ))
            ) : (
              <p>No available times for the selected date.</p>
            )}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold">Appointment Details</h3>
              <p>Date: {selectedDate.toDateString()}</p>
              <p>Time: {selectedTime}</p>
              <p>Puppy Type: {puppyType}</p>
            </div>
          )}
        </div>

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
              onChange={(e) => setPuppyType(e.target.value as 'GENERAL' | 'STUD' | 'PUPPY')}
              className="p-2 border rounded"
            >
              <option value="" disabled>
                Select Appointment Type
              </option>
              <option value="GENERAL">General</option>
              <option value="STUD">Stud</option>
              <option value="PUPPY">Puppy</option>
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
