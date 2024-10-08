"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { api } from "~/trpc/react";
import "@splidejs/splide/dist/css/splide.min.css";

interface GalleryProps {
  isAdmin: boolean;
}

const folderName = "main_gallery";

const Gallery: React.FC<GalleryProps> = ({ isAdmin }) => {
  const {
    data: photos,
    isLoading,
    refetch,
  } = api.s3.listPhotos.useQuery({ folderName });
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
    <div className="rounded-lg p-6 shadow-md">
      <h2 className="text-md mb-4 font-semibold">Gallery</h2>
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
                className="h-60 w-full rounded-lg object-cover"
              />
              {isAdmin && photo.key && (
                <button
                  onClick={() => handleDelete(photo.key as string)}
                  className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-white"
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
