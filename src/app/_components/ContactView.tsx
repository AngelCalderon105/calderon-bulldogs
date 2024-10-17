"use client";

import { Divide } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface ContactProps {
  isAdmin: boolean;
}

type ContactMethod = "CALL" | "EMAIL" | "FORM";

// ENTER EMAIL AND PHONE NUMBER HERE
const EMAIL = "CHANGETHISEMAIL@website.com";
const PHONE = "SOMEPHONENUMBER";

const ContactView: React.FC<ContactProps> = ({ isAdmin }) => {
  const createFormMutation = api.contact.createForm.useMutation();
  const deleteFormMutation = api.contact.deleteForm.useMutation();
  const {
    data: allForms,
    isLoading,
    isError,
    refetch
  } = api.contact.listAllForms.useQuery();

  const [contactMethod, setContactMethod] = useState<ContactMethod>("FORM");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contactType, setContactType] = useState<
    "GENERAL" | "STUD" | "PURCHASE"
  >("GENERAL");
  const [body, setBody] = useState<string>("");


  const getMethodFunction = (method: ContactMethod) => {
    const handleClick = () => {
      setContactMethod(method);
    };
    return handleClick;
  };

  const handleSubmitForm = async () => {
    try {
      const newForm = await createFormMutation.mutateAsync({
        name,
        email,
        phone,
        contactType,
        body,
      });
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Something went wrong while submitting form: " + error);
      alert("Uh oh! Something went wrong when submitting your form.");
    }
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteFormMutation.mutateAsync({ id: formId });
      await refetch()
      alert(`Form ${formId} deleted successfully. Refresh to see changes.`)
    } catch (error) {
      console.error("Something went wrong while deleting form. " + error)
      alert(`Uh oh! Something went wrong while deleting your form.`)
    }
  }

  return (
    <div className="mx-12 py-12">
      <h1 className="mb-4 font-bold">Contact Us</h1>
      {!isAdmin && (
        <div>
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
                <a
                  href={`tel:${PHONE}`}
                  target="_blank"
                  className="text-red-500"
                >
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
                  <button
                    onClick={handleSubmitForm}
                    className="rounded-lg border-2 border-gray-300 bg-green-600 p-3 text-white disabled:bg-green-100"
                    disabled={!(!!name && !!email && !!phone && !!body)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isAdmin && (
        <div>
          <div className="flex gap-4">
            {allForms?.map((form) => {
              return (
                <div key={form.id} className="border-2 border-gray-200 rounded-lg h-fit p-4">
                  <p>
                    <strong>Name: </strong>
                    {form.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {form.email}
                  </p>
                  <p>
                    <strong>Phone: </strong>
                    {form.phone}
                  </p>
                  <p>
                    <strong>Contact Type: </strong>
                    {form.contactType}
                  </p>
                  <p>
                    <strong>Body: </strong>
                    {form.body}
                  </p>
                  <button onClick={() => { handleDeleteForm(form.id) }} className="bg-red-500 rounded-lg px-3 py-1 text-white">Delete</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactView;
