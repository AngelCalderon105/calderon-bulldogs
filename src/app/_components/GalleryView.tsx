"use client";
import { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { api } from "~/trpc/react";
import "@splidejs/splide/dist/css/splide.min.css";

interface GalleryProps {
  isAdmin: boolean,
  galleryType: string;
}

const Gallery: React.FC<GalleryProps> = ({ isAdmin, galleryType }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
// Fetch photos based on the selected tag
const { data: photos, isLoading, refetch } = api.s3.listPhotos.useQuery(
  
  { tag: selectedTag || "" }, // Pass selected tag or empty string
  { enabled: !!selectedTag || selectedTag === null } // Ensure query only triggers after tag selection
);
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

   // Refetch photos when the selected tag changes
   useEffect(() => {
    refetch();
  }, [selectedTag, refetch]);
  
  useEffect(() => {
    if (galleryType === "Stud Gallery") {
      setSelectedTag("stud");
    }
  }, [galleryType]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!photos || photos.length === 0) {
    return <div>No photos available</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="text-md font-semibold mb-4">{galleryType}</h2>
      {galleryType == "Main Gallery" ? <div className="mb-4">
        <label htmlFor="tagSelect" className="mr-2">Filter by Tag:</label>
        <select
          id="tagSelect"
          className="border px-2 py-1"
          value={selectedTag || ""}
          onChange={(e) => setSelectedTag(e.target.value || null)}
        >
          <option value="">All</option>
          <option value="puppy">Puppy</option>
          <option value="mother">Mother</option>
          <option value="stud">Stud</option>
        </select>
      </div> :  null} 
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
