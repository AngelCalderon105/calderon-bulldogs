"use client";

import { useState } from "react";

interface ContactProps {
  isAdmin: boolean;
}

type ContactMethod = "CALL" | "EMAIL" | "FORM";


// ENTER EMAIL AND PHONE NUMBER HERE
const EMAIL = "CHANGETHISEMAIL@website.com"
const PHONE = "SOMEPHONENUMBER"

const ContactView: React.FC<ContactProps> = ({ isAdmin }) => {
  const [contactMethod, setContactMethod] = useState<ContactMethod>("FORM");

  const getMethodFunction = (method: ContactMethod) => {
    const handleClick = () => {
      setContactMethod(method);
    };
    return handleClick;
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
            <a className="border-2 border-gray-500 bg-gray-200 p-2 text-red-500" href={`mailto:${EMAIL}`} target="_blank">
              {EMAIL}
            </a>
          </div>
        )}
        {contactMethod === "FORM" && (
          <div>
            <form className="flex flex-col gap-3">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="border-2 border-gray-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="border-2 border-gray-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone">Phone #</label>
                <input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  className="border-2 border-gray-200"
                  required
                />
              </div>
              <div>
                <input
                  name="inquiry"
                  id="general"
                  type="radio"
                  value="general"
                />
                <label htmlFor="general">General</label>
                <br />
                <input name="inquiry" id="stud" type="radio" value="stud" />
                <label htmlFor="stud">Stud Service</label>
                <br />
                <input
                  name="inquiry"
                  id="purchase"
                  type="radio"
                  value="purchase"
                />
                <label htmlFor="purchase">Purchase</label>
                <br />
              </div>
              <div>
                <label htmlFor="body">Body</label>
                <textarea
                  name="body"
                  id="body"
                  className="border-2 border-gray-200"
                  required
                />
              </div>
              <div>
                <input
                  type="submit"
                  className="border-2 border-gray-500 bg-gray-200 p-2"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactView;
