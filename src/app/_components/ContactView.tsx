"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

import Envelope from "../../../public/EnvelopeSimple.svg";
import Phone from "../../../public/Phone.svg";
import Instagram from "../../../public/Instagram.svg";
import Arrow from "../../../public/Arrow.svg"
import Check from "../../../public/CheckCircle.svg";

interface ContactProps {
  isAdmin: boolean;
}

const ContactView: React.FC<ContactProps> = ({ isAdmin }) => {
  const createFormMutation = api.contact.createForm.useMutation();
  const deleteFormMutation = api.contact.deleteForm.useMutation();
  const { data: allForms, refetch } = api.contact.listAllForms.useQuery();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contactType, setContactType] = useState<"GENERAL" | "STUD" | "PURCHASE">("GENERAL");
  const [selectValue, setSelectValue] = useState<string>(""); // For displaying "Topic" as the default placeholder
  const [body, setBody] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  function getFullName(firstName : string, lastName: string) {
    return `${firstName} ${lastName}`;
  }

  const handleSubmitForm = async () => {
    try {
      await createFormMutation.mutateAsync({
        name: getFullName(firstName, lastName),
        email,
        phone,
        contactType, // Only "GENERAL" | "STUD" | "PURCHASE" here
        body,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Something went wrong while submitting form: ", error);
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
      console.error("Something went wrong while deleting form: ", error);
      alert("Uh oh! Something went wrong when deleting the form.");
    }
  };

  return ( 
    <>
    {isAdmin ? (
      <>
      <h2 className="text-2xl font-bold font-georgia md:text-3xl" style={{ color: "#1E2D67" }}>Customer Contact Forms </h2>
      <div className="space-y-4 flex flex-row gap-5 m-4 bg-gradient-to-r from-[#F2F7FF] to-[#D2E1FB]">
        {allForms?.map((form) => (
          <div key={form.id} className=" flex flex-col gap-4  border-2 bg-white border-gray-200 rounded-lg px-8  py-8 m-4">
            <p><strong>Name: </strong>{form.name}</p>
            <p><strong>Email: </strong>{form.email}</p>
            <p><strong>Phone: </strong>{form.phone}</p>
            <p><strong>Contact Type: </strong>{form.contactType}</p>
            <p><strong>Body: </strong>{form.body}</p>
            <button onClick={() => handleDeleteForm(form.id)} className="bg-red-500 rounded-lg px-3 py-1 text-white">Delete</button>
          </div>
        ))}
      </div>
        </>
    ) : (
      <>
      <div className="flex flex-col md:items-center lg:flex-row bg-gradient-to-r from-[#F2F7FF] to-[#D2E1FB] p-8 shadow-lg relative space-y-6 lg:justify-between xl:justify-around">
      <div className="flex flex-col space-y-4 text-center lg:text-left w-full md:w-11/12 lg:w-1/3">
        <h2 className="text-2xl font-bold font-georgia md:text-3xl" style={{ color: "#1E2D67" }}>Contact Us</h2>
      
      <p className="text-sm text-[#1E1E1E] md:leading-6">
          Contact us directly or fill out our contact form. We look forward to connecting with you!
        </p>
  <div className="flex flex-col items-center space-y-3 md:space-y-0 md:grid md:gap-3 md:grid-cols-2 lg:flex-col lg:items-start justify-center w-full lg:flex">
    <a href="mailto:calderonbulldogs@gmail.com" className="flex items-center bg-white justify-center  text-blue_darker md:place-self-end lg:place-self-auto border-2 
    border-blue_darker rounded-full py-1 max-w-fit px-6">
    <Envelope className="mr-2" />
    <span className="font-sans text-custom-14 font-medium text-left py-1.5  ">
      <p>calderonbulldogs@gmail.com</p>
    </span>
  </a>

  <a href="tel:+17142329787" className="flex items-center bg-white justify-center  text-blue_darker space-x-2 border-2
   border-blue_darker rounded-full px-6 py-2 max-w-fit">
    <Phone className="mx-1" />
    <span className="font-sans text-custom-14 font-medium text-left py-0.5 ">
      <p>(714)-232-9787</p>
    </span>
  </a>

  <a href="https://www.instagram.com/calderon_bulldogs/" className=" flex items-center md:col-span-2 md:place-self-center lg:place-self-auto bg-white justify-center md:justify-center text-blue_darker space-x-2 border-2
   border-blue_darker rounded-full px-6 py-1 max-w-fit " target="_blank" rel="noopener noreferrer">
    <Instagram className="mx-1" />
    <span className="font-sans text-custom-14 font-medium py-1 text-left lg:p-1 ">
      @calderonbulldogs
    </span>
  </a>
</div>
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

      
      <div className="bg-white rounded-3xl p-6 shadow-md w-full md:w-11/12 ml-auto md:m-0 space-y-4 md:flex md:justify-center md:items-center lg:w-6/12 xl:w-5/12 2xl:w-4/12">
      {submitted ? (
        //Thank you form
        <div className="space-y-4 lg:h-96 md:w-11/12 mt-5 lg:flex lg:justify-center">
        <div className="space-y-2 flex flex-col items-center justify-center">
          <Check/>
          <h1 className="font-georgia font-bold text-lg">Thank You</h1>
          <h2 className="font-georgia">Your form has been submitted.</h2>
          
        </div> 
      </div>) 
      : (
        <div className="space-y-4 md:w-11/12 mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-blue_darker rounded-lg p-2 py-2.5 text-sm w-full placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
              required
              />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-blue_darker rounded-lg p-2 py-2.5 text-sm w-full placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
              />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-blue_darker rounded-lg p-2 py-2.5 text-sm w-full placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
              />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-blue_darker rounded-lg p-2 py-2.5 text-sm w-full placeholder-[#4E76BB] placeholder-opacity-80 focus:border-blue-400"
              />
          </div>
          <div className="relative w-full">
          <select
            className={`border border-blue_darker rounded-lg p-2 py-2.5 w-full text-sm appearance-none 
              ${selectValue === "" ? "text-[#4E76BB] text-opacity-80" : "text-gray-700"} 
              focus:border-blue-400`}
              value={selectValue}
              onChange={handleSelectChange}
              >
            <option value="" disabled>
              Topic
            </option>
            <option value="GENERAL" className="text-blue_darker">General</option>
            <option value="STUD" className="text-blue_darker">Stud Service</option>
            <option value="PURCHASE" className="text-blue_darker">Purchase Puppy</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Arrow classname=""/>
          </div>
        </div>
          <textarea
            placeholder="Write message here"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border border-blue_darker rounded-lg p-3 w-full text-xs md:text-base h-32 placeholder-[#4E76BB] placeholder-opacity-80"
            />
          <div className="flex justify-center">
            <button
              onClick={handleSubmitForm}
              className="w-full md:w-[200px] bg-blue_dark text-white py-2 rounded-full hover:bg-blue_darker"
              >
              Submit
            </button>
          </div>
        </div>)}
      </div>
      
    </div>
    
      </>)}
              </>
);
};

export default ContactView;
