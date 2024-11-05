"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import StudProfile from "./StudProfile";
import MultipleFileUpload from "./MultipleFileUpload";

interface StudManagementProps {
  isAdmin: boolean;
}

export default function StudManagement({ isAdmin }: StudManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [stud, setStud] = useState({
    name: "",
    birthdate: "",
    breed: "",
    color: "",
    status: "",
    price: 0,
  });

  const { data: studs, isLoading, error } = api.studProfile.listStuds.useQuery();
  const createStudMutation = api.studProfile.createStud.useMutation();
  const deleteStudMutation = api.studProfile.deleteStud.useMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stud profiles.</div>;

  const handleInputChange = (field: string, value: any) => {
    setStud((prevStud) => ({
      ...prevStud,
      [field]: value,
    }));
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to remove this stud profile?")) {
      try {
        await deleteStudMutation.mutateAsync({ id });
        alert("Stud profile deleted.");
      } catch (error) {
        console.error("Error deleting stud profile:", error);
        alert("Failed to delete stud profile.");
      }
    }
  };

  const handleStudFormSubmit = async () => {
    try {
      await createStudMutation.mutateAsync(stud);
      alert("Stud profile successfully created!");
    } catch (error) {
      console.error("Error creating stud profile:", error);
      alert("Failed to create stud profile.");
    }
  };

  return (
    <div className="mx-8">
      {isAdmin ? (
        <h2 className="text-md font-semibold my-8">Stud Management</h2>
      ) : (
        <h2 className="text-md font-semibold my-8">Available Studs</h2>
      )}
      <div className="">
        {studs?.map((stud) => (
          <Link href={`/studcatalog/${stud.id}`} key={stud.id}>
            <StudProfile
              key={stud.id}
              stud={stud}
              isAdmin={isAdmin}
              onDelete={() => handleDelete(stud.id)}
            />
          </Link>
        ))}
      </div>
      {isAdmin && (
        <button
          className="mt-4 p-4 bg-blue-600 text-white rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Stud"}
        </button>
      )}
      {showForm && (
        <div>
          <label>
            Name:
            <input
              type="text"
              value={stud.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Birth Date:
            <input
              type="date"
              value={stud.birthdate}
              onChange={(e) => handleInputChange("birthdate", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Breed:
            <input
              type="text"
              value={stud.breed}
              onChange={(e) => handleInputChange("breed", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Color:
            <input
              type="text"
              value={stud.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Status:
            <input
              type="text"
              value={stud.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              value={stud.price}
              onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
              className="block border rounded p-2 my-2"
            />
          </label>
          <MultipleFileUpload 
            galleryType="stud_galleries" 
            puppyName={stud.name} // Passing `stud.name` as `puppyName` to make it compatible with `MultipleFileUpload`
          />
          <button className="p-2 bg-green-600 text-white rounded" onClick={handleStudFormSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
