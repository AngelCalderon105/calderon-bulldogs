"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import PuppyProfile from "./PuppyProfile";
import GalleryView from "./GalleryView"
import MultipleFileUpload from "./MultipleFileUpload";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { Options } from "@splidejs/splide";



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
  const [editingPuppyId, setEditingPuppyId] = useState<number | null>(null);
  const [puppy, setPuppy] = useState({
    name: "",
    birthdate: "",
    dateAvailable: "",
    status:"Available" as "Available" | "Sold" | "Reserved",
    color: "",
    price: 0,
    breed: "",
    sex: "Non_Specified" as "Male" | "Female",
    personality: [] as typeof personalityOptions[number][],
    description: "",
  });

  const { data: puppies, isLoading, error } = api.puppyProfile.listPuppies.useQuery();
  const createPuppyMutation = api.puppyProfile.createPuppy.useMutation();
  const updatePuppyMutation = api.puppyProfile.updatePuppy.useMutation();
  const deletePuppyMutation = api.puppyProfile.deletePuppy.useMutation();
  const deletePuppyGalleryMutation = api.s3.deleteAllPuppyPhotos.useMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puppy profiles.</div>;

  const handleInputChange = (field: string, value: any) => {
    setPuppy((prevPuppy) => ({
      ...prevPuppy,
      [field]: value,
    }));
  };

  const handlePersonalityChange = (trait: typeof personalityOptions[number]) => {
    setPuppy((prevPuppy) => {
      const newTraits = prevPuppy.personality.includes(trait)
        ? prevPuppy.personality.filter((t) => t !== trait)
        : [...prevPuppy.personality, trait];
      return { ...prevPuppy, personality: newTraits };
    });
  };

  const handleEdit = (puppyToEdit: any) => {
    setEditingPuppyId(puppyToEdit.id);
    setPuppy({
      ...puppyToEdit,
      birthdate: puppyToEdit.birthdate
        ? new Date(puppyToEdit.birthdate).toISOString().split("T")[0]
        : "", // Fallback to an empty string if null/undefined
      dateAvailable: puppyToEdit.dateAvailable
        ? new Date(puppyToEdit.dateAvailable).toISOString().split("T")[0]
        : "", // Fallback to an empty string if null/undefined
    });
    setShowForm(true);
  };
  

  const handleDeletePuppy = async (id: number, puppyName : string) => {
    if (confirm("Are you sure you want to delete this puppy and its images?")) {
      const formattedTag = "puppy_galleries/" + (puppyName || "").toLowerCase().replace(/\s+/g, "_") + "_gallery";
      try {
        await deletePuppyGalleryMutation.mutateAsync({ folder: formattedTag });
  
        await deletePuppyMutation.mutateAsync({ id });
  
        alert("Puppy and gallery deleted successfully!");
      } catch (error) {
        console.error("Error deleting puppy or gallery:", error);
        alert("Failed to delete puppy and/or gallery.");
      }
    }
  };
  

  const handlePuppyFormSubmit = async () => {
    try {
      if (editingPuppyId) {
        await updatePuppyMutation.mutateAsync({ id: editingPuppyId, ...puppy });
        alert("Puppy profile successfully updated!");
      } else {
        await createPuppyMutation.mutateAsync(puppy);
        alert("Puppy profile successfully created!");
      }
      setEditingPuppyId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving puppy profile:", error);
      alert("Failed to save puppy profile.");
    }
  };

  const ClientOptions={
    perPage: 3,
    gap: "6rem",
    pagination: false,
    arrows: false,

    autoplay: false,
    interval: 3000,
    pauseOnHover: true,

    breakpoints: {
     
      600: {
        perPage: 1,
        gap: "1rem",
        pagination: false,
         padding: { right: '10%' }
      },
      768: {
        perPage: 2,
        gap: "1rem",        
        padding: { right: '5%' }
      },
      1024: {
        perPage: 2,
        gap: "2rem",
    
        padding: { right: '10%' }
    },
    1280: {
      perPage: 3,
      gap: "1.2rem",
      padding: { right: '0' }
  },
      1490: {
        perPage: 3,
        gap: "2rem",
    },
    },
  }

  const AdminOptions={
    perPage: 3,
    gap: "2rem",
    pagination: false,
    arrows: true,
    drag: false,
    

    breakpoints: {
     
     
    },
  }

  return (
    <div className="xl:flex xl:justify-center">

    <div className="ml-4 md:ml-8 lg:mx-4 2xl:mx-20  mt-10 mb-14 xl:max-w-7xl">
      {isAdmin ? (
        <h2 className="text-md font-semibold font-georgia my-8">Puppy Management</h2>
      ) : (
        <h2 className="text-3xl font-semibold my-8 mb-10 font-georgia">Featured Puppies</h2>
      )}

      <div className="2xl:mx-8">
     
        <Splide
        options={!isAdmin ? ClientOptions : AdminOptions}
        
        >
        
        {puppies?.map((puppy) => (
          
          <SplideSlide >

          <div className="" key={puppy.id}>
            <Link href={`/puppycatalog/${puppy.id}`}>
              <PuppyProfile
                puppy={puppy}
                isAdmin={isAdmin}
                onDelete={() => handleDeletePuppy(puppy.id, puppy.name)}
                />
            </Link>
            {isAdmin && (
              <>
                <button
                  className="mt-2 p-2 bg-green-500 text-white rounded "
                  onClick={() => handleEdit(puppy)}
                  >
                  Edit Puppy Info
                </button>
                <GalleryView isAdmin={true} galleryType = "puppy_galleries" galleryName ={ `${puppy.name.toLowerCase().replace(/\s+/g, "_")}_gallery`}/>
                <MultipleFileUpload galleryType="puppy_galleries" puppyName={puppy.name} />
              </>
            )}
          </div>
            </SplideSlide>
        ))}
        </Splide>
      </div>
      {isAdmin && (
        <button
        className="mt-4 p-4 bg-blue-600 text-white rounded"
        onClick={() => {
          setShowForm(!showForm);
          if (!showForm) setEditingPuppyId(null);
        }}
        >
          {showForm ? "Cancel" : editingPuppyId ? "Edit Puppy" : "Add Puppy"}
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
          Status:<br/>
          Current Status : <strong>{puppy.status}</strong>
            <select
              value={puppy.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="block border rounded p-2 my-2"
              >
              <option value={puppy.status}>Select Status</option>
              <option value="Available">Available </option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
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
            {editingPuppyId ? "Update Puppy" : "Submit"}
          </button>
        </div>
      )}
    </div>
      </div>
  );
}
