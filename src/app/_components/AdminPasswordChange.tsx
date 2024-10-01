"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react"; 

const AdminPasswordChange: React.FC = () => {
  const [newPassword, setNewPassword] = useState(""); 
  const [message, setMessage] = useState("");

  const { mutate: updatePassword, isError } = api.admin.updatePassword.useMutation({
    onSuccess: () => {
      setMessage("Password updated successfully!");
      setNewPassword("");
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatePassword({ newPassword }); 
  };

  return (
    <div className="py-4">
      <h2 className="font-bold text-xl mb-4">Change Password</h2>
      <form onSubmit={handlePasswordUpdate}>
        <div>
          <label htmlFor="new-password" className="block mb-2">New Password:</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block border rounded p-2 mb-4 w-full"
            required
            minLength={6} 
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-green-600 text-white rounded"
        >
          Update Password
        </button>
      </form>
      {isError && <p>Error updating password</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminPasswordChange;
