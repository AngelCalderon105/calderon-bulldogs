"use client";
import { getSession } from 'next-auth/react';
import React, { useState } from "react";
import { api } from "~/trpc/react";

const AdminEmailUpdate: React.FC = () => {
  const [newEmail, setNewEmail] = useState(""); 
  const [message, setMessage] = useState("");

  const { mutate: updateEmail, isError } = api.admin.updateEmail.useMutation({
    onSuccess: async () => {
      setMessage("Email updated successfully!");
      setNewEmail("");

      // Re-fetch the session to update the email
      const session = await getSession();
      console.log('Updated session:', session);
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  const handleEmailUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEmail({ newEmail });
  };

  return (
    <div className="py-4">
      <h2 className="font-bold text-xl mb-4">Update Email</h2>
      <form onSubmit={handleEmailUpdate}>
        <div>
          <label htmlFor="new-email" className="block mb-2">New Email:</label>
          <input
            id="new-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="block border rounded p-2 mb-4 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded"
        >
          Update Email
        </button>
      </form>
      {isError && <p>Error updating email</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminEmailUpdate;
