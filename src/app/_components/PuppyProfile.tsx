import React from 'react'
import GalleryView from "~/app/_components/GalleryView"


interface PuppyType {
    id: number;
    name: string;
    birthdate: Date;  // Assuming birthdate is stored as a string in ISO format
    color: string;
    status: string;
    price: number;
  }
  interface PuppyProfileProps {
    puppy: PuppyType;
    isAdmin: boolean;
    onDelete?: () => void;
  }

  const PuppyProfile: React.FC<PuppyProfileProps> = ({ puppy, isAdmin, onDelete }) => {
    const formattedName = (puppy.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery"
    return (
        <div className="border rounded-lg p-4 shadow-md">
          <GalleryView isAdmin = {true} galleryType="puppy_galleries" galleryName ={formattedName}/>
          <h3 className="text-lg font-semibold">{puppy.name}</h3>
          <p><strong>Birthdate:</strong> {new Date(puppy.birthdate).toLocaleDateString()}</p>
          <p><strong>Color:</strong> {puppy.color}</p>
          <p><strong>Status:</strong> {puppy.status}</p>
          <p><strong>Price:</strong> ${puppy.price.toFixed(2)}</p>
          {isAdmin && onDelete && (
        <button
          onClick={onDelete}
          className=" bg-red-500 text-white px-2 py-1 rounded"
        >
          Remove
        </button>
      )}
        </div>
      );
}
export default PuppyProfile;