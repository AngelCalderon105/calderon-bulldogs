import React, { useState } from "react";

interface PersonalInfoProps {
  title: string;
  onNext: (data: { firstName: string; lastName: string; email: string; phone: string }) => void; // Callback to send form data
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ title, onNext }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    phone: false,
  });

  // Validate email format
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate phone format (10-digit)
  const validatePhone = (phone: string) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  // Handle input changes and validate
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    setFormData(updatedData);

    // Perform validation
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: !validateEmail(value) }));
    }
    if (name === "phone") {
      setErrors((prev) => ({ ...prev, phone: !validatePhone(value) }));
    }
  };

  // Check if all fields are valid
  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    !errors.email &&
    !errors.phone;

  // Handle "Next" button click
  const handleNext = () => {
    if (isFormValid) {
      onNext(formData); // Send valid data to the parent
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      {/* Section Title */}
      <h3 className="text-lg font-bold text-[#344EAD]">{title}</h3>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="border border-gray-300 rounded-lg p-2 text-sm w-full focus:border-blue-500"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="border border-gray-300 rounded-lg p-2 text-sm w-full focus:border-blue-500"
        />
      </div>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className={`border rounded-lg p-2 text-sm w-full focus:border-blue-500 ${
          errors.email ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.email && <p className="text-sm text-red-500">Invalid email format</p>}

      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className={`border rounded-lg p-2 text-sm w-full focus:border-blue-500 ${
          errors.phone ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.phone && <p className="text-sm text-red-500">Phone number must be 10 digits</p>}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!isFormValid}
          onClick={handleNext}
          className={`px-6 py-2 rounded-full text-sm ${
            isFormValid
              ? "bg-[#344EAD] text-white hover:bg-blue-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
