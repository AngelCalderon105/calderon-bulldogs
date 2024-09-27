"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface ContactProps {
  isAdmin: boolean;
}

type ContactMethod = "CALL" | "EMAIL" | "FORM";

// ENTER EMAIL AND PHONE NUMBER HERE
const EMAIL = "CHANGETHISEMAIL@website.com";
const PHONE = "SOMEPHONENUMBER";

const ContactView: React.FC<ContactProps> = ({ isAdmin }) => {
  const createFormMutation = api.contact.createForm.useMutation()

  const [contactMethod, setContactMethod] = useState<ContactMethod>("FORM");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contactType, setContactType] = useState<
    "GENERAL" | "STUD" | "PURCHASE"
  >("GENERAL");
  const [body, setBody] = useState<string>("");

  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)


  const getMethodFunction = (method: ContactMethod) => {
    const handleClick = () => {
      setContactMethod(method);
    };
    return handleClick;
  };

  const handleSubmitForm = async () => {
    try {
      const newForm = await createFormMutation.mutateAsync({ name, email, phone, contactType, body });
      alert("Form submitted successfully!")
    } catch (error) {
      console.error("Something went wrong while submitting form: " + error)
      alert("Uh oh! Something went wrong when submitting your form.")
    }
  };

  return (
    <div className="mx-12 py-12">
      <h1 className="mb-4 font-bold">Contact Us</h1>
      <h2>Select contact method:</h2>
      <div className="mb-4 flex gap-2 text-blue-400">
        <button onClick={getMethodFunction("CALL")}>CALL</button>
        <button onClick={getMethodFunction("EMAIL")}>EMAIL</button>
        <button onClick={getMethodFunction("FORM")}>FORM</button>
      </div>
      <div className="min-h-[320px] w-80 border-2 border-gray-200">
        {contactMethod === "CALL" && (
          <div>
            <h3>Call us at the number below:</h3>
            <a href={`tel:${PHONE}`} target="_blank" className="text-red-500">
              {PHONE}
            </a>
          </div>
        )}
        {contactMethod === "EMAIL" && (
          <div>
            <h3 className="mb-4">Email us here:</h3>
            <a
              className="border-2 border-gray-500 bg-gray-200 p-2 text-red-500"
              href={`mailto:${EMAIL}`}
              target="_blank"
            >
              {EMAIL}
            </a>
          </div>
        )}
        {contactMethod === "FORM" && (
          <div className="[&>h3]:font-bold">
            <h3>Name</h3>
            <input
              type="text"
              onChange={(event) => {
                event.preventDefault();
                setName(event.target.value);
              }}
              className="border-2 border-gray-300"
              required
            />

            <h3>Email</h3>
            <input
              type="text"
              onChange={(event) => {
                event.preventDefault();
                setEmail(event.target.value);
              }}
              className="border-2 border-gray-300"
            />

            <h3>Phone</h3>
            <input
              type="text"
              onChange={(event) => {
                event.preventDefault();
                setPhone(event.target.value);
              }}
              className="border-2 border-gray-300"
            />

            <h3>Contact Type</h3>
            <div className="flex gap-4 text-green-600">
              <button
                onClick={() => {
                  setContactType("GENERAL");
                }}
                className={`${contactType == "GENERAL" && "font-bold underline"}`}
              >
                General
              </button>
              <button
                onClick={() => {
                  setContactType("STUD");
                }}
                className={`${contactType == "STUD" && "font-bold underline"}`}
              >
                Stud Service
              </button>
              <button
                onClick={() => {
                  setContactType("PURCHASE");
                }}
                className={`${contactType == "PURCHASE" && "font-bold underline"}`}
              >
                Purchase Puppy
              </button>
            </div>

            <h3>Body</h3>
            <textarea
              onChange={(event) => {
                event.preventDefault();
                setBody(event.target.value);
              }}
              className="border-2 border-gray-300"
            />

            <div>
              <button onClick={handleSubmitForm} className="rounded-lg border-2 border-gray-300 p-3 bg-green-600 text-white disabled:bg-green-100" disabled={!(!!name && !!email && !!phone && !!body)} >Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactView;
