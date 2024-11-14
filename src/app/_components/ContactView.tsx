"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Mail, Phone, Instagram } from "lucide-react";

interface ContactProps {
  isAdmin: boolean;
}

const EMAIL = "calderonbulldogs@gmail.com";
const PHONE = "+1 (123) 456 7890";
const INSTAGRAM = "@calderonbulldogs";

const ContactView: React.FC<ContactProps> = ({ isAdmin }) => {
  const createFormMutation = api.contact.createForm.useMutation();
  const deleteFormMutation = api.contact.deleteForm.useMutation();
  const { data: allForms, refetch } = api.contact.listAllForms.useQuery();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contactType, setContactType] = useState<"GENERAL" | "STUD" | "PURCHASE">("GENERAL");
  const [body, setBody] = useState<string>("");

  const handleSubmitForm = async () => {
    try {
      await createFormMutation.mutateAsync({ name, email, phone, contactType, body });
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Something went wrong while submitting form: " + error);
      alert("Uh oh! Something went wrong when submitting your form.");
    }
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
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-[#D2E1FB] to-[#D2E1FB] rounded-lg p-10 shadow-lg space-y-6 md:space-y-0 md:space-x-8 relative">
      {/* Decorative Paw SVGs */}
      <div className="absolute top-10 left-10 opacity-20">
        <img src="/assets/Vector.svg" alt="Paw Icon" className="w-10 h-10" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <img src="/assets/Vector (1).svg" alt="Paw Icon" className="w-10 h-10" />
      </div>

      <div className="space-y-4 text-center md:text-left w-full md:w-1/3">
        <h2 className="text-2xl font-bold" style={{ color: "#1E2D67" }}>Contact Us</h2>
        <p className="text-sm text-gray-600">
          Contact us directly or fill out our contact form. We look forward to connecting with you!
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-center md:justify-start text-blue-600 space-x-2 border rounded-full px-4 py-2 border-[#133591] w-[240px]">
            <Mail className="w-5 h-5" />
            <span>{EMAIL}</span>
          </div>
          <div className="flex items-center justify-center md:justify-start text-blue-600 space-x-2 border rounded-full px-4 py-2 border-[#133591] w-[240px]">
            <Phone className="w-5 h-5" />
            <span>{PHONE}</span>
          </div>
          <div className="flex items-center justify-center md:justify-start text-blue-600 space-x-2 border rounded-full px-4 py-2 border-[#133591] w-[240px]">
            <Instagram className="w-5 h-5" />
            <span>{INSTAGRAM}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md w-full md:w-2/3 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-[#133591] rounded-lg p-2 text-sm w-full focus:border-blue-400" required />
            <input type="text" placeholder="Last Name" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-[#133591] rounded-lg p-2 text-sm w-full focus:border-blue-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-[#133591] rounded-lg p-2 text-sm w-full focus:border-blue-400" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-[#133591] rounded-lg p-2 text-sm w-full focus:border-blue-400" />
          </div>
          <select className="border border-[#133591] rounded-lg p-2 w-full text-sm text-gray-500 focus:border-blue-400" value={contactType} onChange={(e) => setContactType(e.target.value as "GENERAL" | "STUD" | "PURCHASE")}>
            <option value="GENERAL">General</option>
            <option value="STUD">Stud Service</option>
            <option value="PURCHASE">Purchase Puppy</option>
          </select>
          <textarea placeholder="Write message here" value={body} onChange={(e) => setBody(e.target.value)} className="border border-[#133591] rounded-full p-2 w-full text-sm h-24 focus:border-blue-400" />
          <button onClick={handleSubmitForm} className="w-[240px] bg-[#1E2D67] text-white py-3 rounded-lg hover:bg-blue-800">Submit</button>
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
