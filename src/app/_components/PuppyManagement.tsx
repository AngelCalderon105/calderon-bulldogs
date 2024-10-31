"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import PuppyProfile from "./PuppyProfile";
import MultipleFileUpload from "./MultipleFileUpload";

interface PuppyManagement {
  isAdmin: boolean;
}

export default function PuppyManagement({ isAdmin }: PuppyManagement) {
  const [showForm, setShowForm] = useState(false);
  const [puppy, setPuppy] = useState({
    name: "",
    birthdate: "",
    color: "",
    status: "",
    price: 0,
  });
  const { data: puppies, isLoading, error } = api.puppyProfile.listPuppies.useQuery();
  const createPuppyMutation = api.puppyProfile.createPuppy.useMutation();
  const deletePuppyMutation = api.puppyProfile.deletePuppy.useMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puppy profiles.</div>;

  const handleInputChange = (field: string, value: any) => {
    setPuppy((prevPuppy) => ({
      ...prevPuppy,
      [field]: value,
    }));
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to remove this puppy profile?")) {
      try {
        await deletePuppyMutation.mutateAsync({ id });
        alert("Puppy profile deleted.");
      } catch (error) {
        console.error("Error deleting puppy profile:", error);
        alert("Failed to delete puppy profile.");
      }
    }
  };

  const handlePuppyFormSubmit = async () => {
    try {
      await createPuppyMutation.mutateAsync(puppy);
      alert("Puppy profile successfully created!");
    } catch (error) {
      console.error("Error creating puppy profile:", error);
      alert("Failed to create puppy profile.");
    }
  };

  return (
    <div className="mx-8">
      {isAdmin ? (
        <h2 className="text-md font-semibold my-8">Puppy Management</h2>
      ) : (
        <h2 className="text-md font-semibold my-8">Available Puppies</h2>
      )}
      <div className="">
        {puppies?.map((puppy) => (
           <Link href={`/puppycatalog/${puppy.id}`} key={puppy.id}>
          <PuppyProfile
            key={puppy.id}
            puppy={puppy}
            isAdmin={isAdmin}
            onDelete={() => handleDelete(puppy.id)}
            />
            </Link>
        ))}
      </div>
      {isAdmin && (
        <button
          className="mt-4 p-4 bg-blue-600 text-white rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Puppy"}
        </button>
      )}
      {showForm && (
        <div>
          <label>
            Name:
            <input
              type="text"
              value={puppy.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Birth Date:
            <input
              type="date"
              value={puppy.birthdate}
              onChange={(e) => handleInputChange("birthdate", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Color:
            <input
              type="text"
              value={puppy.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Status:
            <input
              type="text"
              value={puppy.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              value={puppy.price}
              onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
              className="block border rounded p-2 my-2"
            />
          </label>
          <MultipleFileUpload galleryType="puppy_galleries" puppyName={puppy.name} />
          <button className="p-2 bg-green-600 text-white rounded" onClick={handlePuppyFormSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
