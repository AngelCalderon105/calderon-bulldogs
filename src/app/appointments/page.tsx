"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function AppointmentScheduler() {
  const router = useRouter();
  const [value, setValue] = useState<Date | null>(new Date());
  const { data: availableDates = [] } = api.availability.getAvailableDates.useQuery<string[]>();
  const [selectedDateString, setSelectedDateString] = useState<string | null>(value?.toISOString().split("T")[0] || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formDetails, setFormDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    appointmentType: ""
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch available timeslots when selectedDateString changes
  const { data: timeslotData } = api.availability.getAvailabilityByDate.useQuery(
    { date: selectedDateString || "" },
    { enabled: !!selectedDateString }
  );

  const timeslots = timeslotData
    ? timeslotData
        .filter((slot) => slot.status === "available")
        .map((slot) => slot.timeSlot)
    : [];

  const handleDateChange = (newValue: Date) => {
    setValue(newValue);
    const dateString = newValue.toISOString().split("T")[0] as string;
    if (availableDates.includes(dateString)) {
      setSelectedDateString(dateString);
    } else {
      setSelectedDateString(null);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Define both mutations for booking a slot and creating an appointment
  const { mutateAsync: bookSlot } = api.availability.bookSlot.useMutation();
  const { mutateAsync: createAppointment } = api.appointment.createAppointment.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message
  
    if (!selectedDateString || !selectedTime) {
      setErrorMessage("Please select a date and time.");
      return;
    }
  
    try {
      // Call the bookSlot mutation to mark the slot as booked
      await bookSlot({
        date: selectedDateString,
        timeSlot: selectedTime,
      });
  
      // If booking is successful, proceed to create the appointment
      const result = await createAppointment({
        customerName: formDetails.fullName,
        customerEmail: formDetails.email,
        customerPhoneNumber: formDetails.phone,
        appointmentType: formDetails.appointmentType.toUpperCase() as 'GENERAL' | 'PUPPY' | 'STUD',
        date: selectedDateString,
        startTime: selectedTime,
      });
  
      if (result) {
        console.log("Appointment created successfully:", {
          selectedDate: selectedDateString,
          selectedTime,
          ...formDetails,
        });
        // Redirect to the Appointment Confirmation page with query parameters
        router.push(`/confirmation?date=${selectedDateString}&time=${selectedTime}&type=${formDetails.appointmentType}`);

        
        // Clear the form after successful booking
        setSelectedDateString(null);
        setSelectedTime(null);
        setFormDetails({
          fullName: "",
          email: "",
          phone: "",
          appointmentType: ""
        });
      }
    } catch (error: any) {
      console.error("Error creating appointment or booking slot:", error);
  
      // Check for 24-hour error specifically
      if (error.message === "Appointments must be booked at least 24 hours in advance.") {
        setErrorMessage("Please choose a date and time at least 24 hours in advance.");
      } else {
        setErrorMessage(error.message || "Failed to book the appointment. Please try again.");
      }
    }
  };

  return (
    <div className="flex gap-10">
      <div>
        <Calendar
          onChange={(newValue) => handleDateChange(newValue as Date)}
          value={value}
          tileClassName={({ date, view }) => {
            const dateString = date.toISOString().split("T")[0] as string;
            const isSelected = value?.toISOString().split("T")[0] === dateString;
            const isAvailable = availableDates.includes(dateString);
            if (view === "month" && isAvailable) {
              return isSelected ? "!bg-blue-700 text-white font-bold rounded-full" : "!bg-blue-500 text-white font-bold rounded-full";
            }
            return "text-gray-400";
          }}
          
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Available Times</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {timeslots.length > 0 ? (
              timeslots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  className={`px-4 py-2 rounded ${
                    selectedTime === time ? "!bg-green-600 text-white" : "!bg-gray-200"
                  }`}
                >
                  {time}
                </button>
              ))
            ) : (
              <p>No available timeslots for the selected date.</p>
            )}
          </div>
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">Schedule an Appointment</h2>
        <p className="text-sm text-gray-500">
          This info will change depending on whether they want a specific breed, puppy, or general visit for puppies.
        </p>
        
        <label className="font-semibold">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formDetails.fullName}
          onChange={handleInputChange}
          className="p-2 border rounded"
          placeholder="Full Name"
          required
        />

        <label className="font-semibold">Email Address</label>
        <input
          type="email"
          name="email"
          value={formDetails.email}
          onChange={handleInputChange}
          className="p-2 border rounded"
          placeholder="Email Address"
          required
        />

        <label className="font-semibold">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formDetails.phone}
          onChange={handleInputChange}
          className="p-2 border rounded"
          placeholder="Phone Number"
          required
        />

        <label className="font-semibold">Select Appointment Type</label>
        <select
          name="appointmentType"
          value={formDetails.appointmentType}
          onChange={handleInputChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Appointment Type</option>
          <option value="GENERAL">General</option>
          <option value="PUPPY">Puppy</option>
          <option value="STUD">Stud</option>
        </select>

        <div className="flex gap-4 mt-4">
          <button type="button" className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Confirm
          </button>
        </div>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </form>
    </div>
  );
}
