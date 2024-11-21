"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

import Envelope from "../../../public/EnvelopeSimple.svg";
import Phone from "../../../public/Phone.svg";
import Instagram from "../../../public/Instagram.svg";
import Arrow from "../../../public/Arrow.svg"

interface ContactProps {
  isAdmin: boolean;
}

const ContactView: React.FC<ContactProps> = ({ isAdmin }) => {
  const createFormMutation = api.contact.createForm.useMutation();
  const deleteFormMutation = api.contact.deleteForm.useMutation();
  const { data: allForms, refetch } = api.contact.listAllForms.useQuery();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contactType, setContactType] = useState<"GENERAL" | "STUD" | "PURCHASE">("GENERAL");
  const [selectValue, setSelectValue] = useState<string>(""); // For displaying "Topic" as the default placeholder
  const [body, setBody] = useState<string>("");
  const handleSubmitForm = async () => {
    try {
      await createFormMutation.mutateAsync({
        name,
        email,
        phone,
        contactType, // Only "GENERAL" | "STUD" | "PURCHASE" here
        body,
      });
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Something went wrong while submitting form: " + error);
      alert("Uh oh! Something went wrong when submitting your form.");
    }
  };
  
  // Update both the selectValue and contactType when a valid option is selected
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectValue(value);
    setContactType(value as "GENERAL" | "STUD" | "PURCHASE");
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteFormMutation.mutateAsync({ id: formId });
      await refetch();
      alert(`Form ${formId} deleted successfully.`);
    } catch (error) {
      console.error("Something went wrong while deleting form: " + error);
      alert("Uh oh! Something went wrong when deleting the form.");
    }
  };

  return (
    <div className="flex flex-col md:items-center lg:flex-row bg-gradient-to-r from-[#F2F7FF] to-[#D2E1FB] p-8 shadow-lg relative space-y-6">
      {/* Left Section with Contact Info */}
      <div className="flex flex-col space-y-4 text-center lg:text-left w-full md:w-11/12 lg:w-1/3">
        <h2 className="text-2xl font-bold font-georgia md:text-3xl" style={{ color: "#1E2D67" }}>Contact Us</h2>
        <p className="text-sm text-[#1E1E1E] md:leading-6">
          Contact us directly or fill out our contact form. We look forward to connecting with you!
        </p>
  <div className="space-y-3 md:space-y-0 md:grid md:gap-3 md:grid-cols-2 md:grid-rows-2 lg:flex-col justify-center w-full">
    <div className="flex items-center bg-white justify-center md:justify-end lg:justify-starts text-secblue border-2 border-[#133591] rounded-full px-2 py-0.5 md:py-0 md:mx-3">
    <Envelope className="mr-2" />
    <span className="font-sans text-custom-14 font-medium text-left py-1.5 md:py-1">
      <p>calderonbulldogs@gmail.com</p>
    </span>
  </div>

  <div className="flex items-center bg-white justify-center md:w-1/2 text-secblue space-x-2 border-2 border-[#133591] rounded-full px-1 py-0.5 w-full md:mx-3">
    <Phone className="mx-1" />
    <span className="font-sans text-custom-14 font-medium text-left py-1.5 md:py-1">
      <p>(714)-232-9787</p>
    </span>
  </div>

  <div className="flex items-center bg-white justify-center md:justify-center md:w-5/12 text-secblue space-x-2 border-2 border-[#133591] rounded-full px-1 py-0.5 w-full md:mx-3 md:col-span-2 md:justify-self-center">
    <Instagram className="mx-1" />
    <span className="font-sans text-custom-14 font-medium py-1.5 text-left ">
      @calderonbulldogs
    </span>
  </div>
</div>

        {/* <div className="hidden sm:flex md:hidden sm:items-center bg-white justify-center text-secblue space-x-2 border border-[#133591] rounded-full px-4 py-0.4 w-[195px]">
            <Instagram className="w-5 h-5" />
            <span className="font-sans text-custom-14 font-medium leading-[30px] text-left">
              {INSTAGRAM}
            </span>
          </div> */}

        {/* Decorative Paw SVGs */}
        {/* Decorative Paw SVGs for Desktop Only */}
      <div className="hidden lg:block relative pt-6">
        <img
          src="/assets/Vector (1).svg"
          alt="Paw Icon"
          className="absolute w-[70px] h-[70px] top-0 left-0"
        />
        <img
          src="/assets/Vector.svg"
          alt="Paw Icon"
          className="absolute w-[70px] h-[70px] top-12 left-20"
        />
      </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-3xl p-6 shadow-md w-full md:w-11/12 ml-auto md:m-0 space-y-4 md:flex md:justify-center md:items-center">
        <div className="space-y-4 md:w-11/12 mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-[#133591] rounded-lg p-2 py-2.5 text-sm w-full placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-[#133591] rounded-lg p-2 py-2.5 text-sm w-full md:max-w-[300px] placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-[#133591] rounded-lg p-2 py-2.5 text-sm w-full md:max-w-[300px] placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#133591] rounded-lg p-2 py-2.5 text-sm w-full md:max-w-[300px] placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
            />
          </div>
          <div className="relative w-full">
  <select
    className={`border border-[#133591] rounded-lg p-2 py-2.5 w-full text-sm appearance-none 
      ${selectValue === "" ? "text-[#4E76BB] text-opacity-80" : "text-gray-700"} 
      focus:border-blue-400`}
    value={selectValue}
    onChange={handleSelectChange}
  >
    <option value="" disabled>
      Topic
    </option>
    <option value="GENERAL" className="text-[#133591]">General</option>
    <option value="STUD" className="text-[#133591]">Stud Service</option>
    <option value="PURCHASE" className="text-[#133591]">Purchase Puppy</option>
  </select>
  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
    <Arrow classname=""/>
  </div>
</div>
          <textarea
            placeholder="Write message here"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border border-[#133591] rounded-lg p-3 w-full text-xs md:text-base h-32 placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
          />
          <div className="flex justify-center">
            <button
              onClick={handleSubmitForm}
              className="w-full md:w-[200px] bg-[#344EAD] text-white py-2 rounded-full hover:bg-blue-800"
            >
              Submit
            </button>
          </div>
        </div>
      </div>


      {isAdmin && (
        <div className="space-y-4">
          {allForms?.map((form) => (
            <div key={form.id} className="border-2 border-gray-200 rounded-lg p-4">
              <p><strong>Name: </strong>{form.name}</p>
              <p><strong>Email: </strong>{form.email}</p>
              <p><strong>Phone: </strong>{form.phone}</p>
              <p><strong>Contact Type: </strong>{form.contactType}</p>
              <p><strong>Body: </strong>{form.body}</p>
              <button onClick={() => handleDeleteForm(form.id)} className="bg-red-500 rounded-lg px-3 py-1 text-white">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactView;
