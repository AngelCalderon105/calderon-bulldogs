import React from 'react';
import GalleryView from "~/app/_components/GalleryView";

interface StudType {
  id: number;
  name: string;
  birthdate: Date;
  breed: string;
  color: string;
  status: string;
  price: number;
}

interface StudProfileProps {
  stud: StudType;
  isAdmin: boolean;
  onDelete?: () => void;
}

const StudProfile: React.FC<StudProfileProps> = ({ stud, isAdmin, onDelete }) => {
  const formattedName = (stud.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery";
  
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <GalleryView isAdmin={isAdmin} galleryType="stud_galleries" galleryName={formattedName} />
      <h3 className="text-lg font-semibold">{stud.name}</h3>
      <p><strong>Birthdate:</strong> {new Date(stud.birthdate).toLocaleDateString()}</p>
      <p><strong>Breed:</strong> {stud.breed}</p>
      <p><strong>Color:</strong> {stud.color}</p>
      <p><strong>Status:</strong> {stud.status}</p>
      <p><strong>Price:</strong> ${stud.price.toFixed(2)}</p>
      {isAdmin && onDelete && (
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-2 py-1 rounded mt-2"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default StudProfile;
