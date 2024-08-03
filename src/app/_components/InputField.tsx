import React from "react";

interface InputFieldProps {
    id: string,
    label: string,
    type: string,
    value: string,
    placeholder: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
}

const CustomInputField: React.FC<InputFieldProps> = ({ id, label, type, value, placeholder, onChange, error, required = false }) => {
    return (
      <div className="flex flex-col">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          className={`p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  };

  export default CustomInputField;