"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { api } from "~/trpc/react";
import "@splidejs/splide/dist/css/splide.min.css";

interface GalleryProps {
  isAdmin: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ isAdmin }) => {
  const { data: photos, isLoading, refetch } = api.s3.listPhotos.useQuery();
  const deletePhotoMutation = api.s3.deletePhoto.useMutation();

  const handleDelete = async (key: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      try {
        await deletePhotoMutation.mutateAsync({ key });
        alert("Photo deleted successfully!");
        refetch(); 
      } catch (error) {
        console.error("Error deleting photo:", error);
        alert("Failed to delete photo.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!photos || photos.length === 0) {
    return <div>No photos available</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="text-md font-semibold mb-4">Gallery</h2>
      <Splide
        options={{
          perPage: 3,
          gap: "1rem",
          pagination: true,
          arrows: true,
          drag: "free",
          breakpoints: {
            640: {
              perPage: 1,
            },
          },
        }}
      >
        {photos.map((photo, index) => (
          <SplideSlide key={index}>
            <div className="relative">
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className="w-full h-60 object-cover rounded-lg"
              />
              {isAdmin && photo.key && ( 
                <button
                  onClick={() => handleDelete(photo.key as string)} 
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Gallery;
