"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import PuppyProfile from "./PuppyProfile";
import MultipleFileUpload from "./MultipleFileUpload";

interface PuppyManagement {
  isAdmin: boolean;
}

const personalityOptions = [
  "calm",
  "shy",
  "happy",
  "lazy",
  "energetic",
  "playful",
  "curious",
  "intelligent",
  "friendly",
  "protective",
  
] as const; 

export default function PuppyManagement({ isAdmin }: PuppyManagement) {
  const [showForm, setShowForm] = useState(false);
  const [puppy, setPuppy] = useState({
    name: "",
    birthdate: "",
    dateAvailable: "",
    color: "",
    price: 0,
    breed: "",
    sex: "Non_Specified" as "Male" | "Female",
    personality: [] as typeof personalityOptions[number][], 
    description: "",
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

  const handlePersonalityChange = (trait: "calm" | "shy" | "happy" | "lazy" | "energetic" | "playful" | "curious" | "intelligent" | "friendly" | "protective") => {
  setPuppy((prevPuppy) => {
    const newTraits = prevPuppy.personality.includes(trait)
      ? prevPuppy.personality.filter((t) => t !== trait) // Remove the trait if it exists
      : [...prevPuppy.personality, trait]; // Add the trait if it doesn't exist
    return { ...prevPuppy, personality: newTraits };
  });
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
        <h2 className="text-2xl font-semibold my-8">Featured Puppies</h2>
      )}
      <div className="flex justify-center flex-wrap md:gap-12">
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
            Date Available:
            <input
              type="date"
              value={puppy.dateAvailable}
              onChange={(e) => handleInputChange("dateAvailable", e.target.value)}
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
            Price:
            <input
              type="number"
              value={puppy.price}
              onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Breed:
            <input
              type="text"
              value={puppy.breed}
              onChange={(e) => handleInputChange("breed", e.target.value)}
              className="block border rounded p-2 my-2"
            />
          </label>
          <label>
            Sex:
            <select
              value={puppy.sex}
              onChange={(e) => handleInputChange("sex", e.target.value)}
              className="block border rounded p-2 my-2"
            >
              <option value="Non_Specified">Select Sex</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </label>
          <label>
            Personality:
            <div className="flex flex-wrap gap-2 my-2">
              {personalityOptions.map((trait) => (
                <div key={trait} className="flex items-center">
                  <input
                    type="checkbox"
                    id={trait}
                    value={trait}
                    checked={puppy.personality.includes(trait)}
                    onChange={() => handlePersonalityChange(trait)}
                  />
                  <label htmlFor={trait} className="ml-2">
                    {trait}
                  </label>
                </div>
              ))}
            </div>
          </label>
          <label>
            Description:
            <textarea
              value={puppy.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="block border rounded p-2 my-2 w-full"
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
