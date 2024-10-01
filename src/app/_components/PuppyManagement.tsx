"use client";
import React, { useState, useEffect } from "react";
import { bool } from 'aws-sdk/clients/signer'
import { api } from "~/trpc/react";
import PuppyProfile from "./PuppyProfile";

interface PuppyManagement{
    isAdmin: bool;
}



export default function PuppyManagement({isAdmin} : PuppyManagement) {
    
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [birthdate, setBirthDate] = useState("");
    const [color,setColor] = useState("");
    const [status,setStatus] = useState("");
    const [price,setPrice] = useState(0);
    const { data: puppies, isLoading, error } = api.puppyProfile.listPuppies.useQuery();

    const createPuppyMutation = api.puppyProfile.createPuppy.useMutation();
    const deletePuppyMutation = api.puppyProfile.deletePuppy.useMutation();


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading puppy profiles.</div>;
    
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

    const HandlePuppyFormSubmit = async () => {
        try {
          await createPuppyMutation.mutateAsync({
            name,
            birthdate,
            color,
            status,
            price,
          });
          alert("Puppy profile successfully created!");
        } catch (error) {
          console.error("Error creating puppy profile:", error);
          alert("Failed to create puppy profile.");
        }
      };
    
      return (
          <div className='mx-8'>
        {isAdmin? <h2 className="text-md font-semibold  my-8">Puppy Management</h2>:
        <h2 className="text-md font-semibold  my-8">Available Puppies</h2>}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {puppies?.map((puppy) => (
            <PuppyProfile 
            key={puppy.id} 
            puppy={puppy}
            isAdmin={isAdmin}
            onDelete={() => handleDelete(puppy.id)} // Passing delete function to PuppyProfile
            />
        ))}
      </div>
        {isAdmin &&
         <button
            className="mt-4 p-4 bg-blue-600 text-white rounded"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Puppy"}
          </button>
            }
          {showForm && (
            <div >
              <div>
                <label>
                  Name:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block border rounded p-2 my-2"
                  />
                </label>
                <label>
                  Birth Date:
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="block border rounded p-2 my-2"
                  />
                </label> <label>
                  Color:
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="block border rounded p-2 my-2"
                  />
                </label> <label>
                  Status:
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block border rounded p-2 my-2"
                  />
                </label> <label>
                  Price:
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) )}
                    className="block border rounded p-2 my-2"
                  />
                </label>
              </div>
              <button className="p-2 bg-green-600 text-white rounded" onClick={HandlePuppyFormSubmit}>
                Submit
              </button>
                
            </div>
          )}
     
         
    </div>
  )
}
