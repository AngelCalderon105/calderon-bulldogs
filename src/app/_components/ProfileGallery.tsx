"use client";
import React, { useState, useRef } from "react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { api } from "~/trpc/react";

interface GalleryProps {
  galleryName: string;
  galleryType: string;
}

const ProfileGallery: React.FC<GalleryProps> = ({galleryType, galleryName }) => {
 
// Fetch photos based on the selected tag
const { data: photos, isLoading, refetch } = api.s3.listPhotos.useQuery(
  { folder: galleryType || "", 
    subfolder: galleryName || ""
  }, // Pass selected tag or empty string

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

  
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainCarouselRef = useRef<any>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!photos || photos.length === 0) {
    return <div>No photos available</div>;
  }

  return (
    <div className="py-6 lg:p-6 rounded-lg shadow-md ">
      {galleryName == "Main Gallery" ? <div className="mb-4">

      </div> :  null} 
      <Splide
        options={{
          type: "fade",
          pagination: false,
          arrows: true,
          drag: "free",
        }}
        ref={mainCarouselRef}
        onMove={(splide) => setCurrentIndex(splide.index)}
        className="mb-4"
      >
        {photos.map((photo, index) => (
          <SplideSlide key={index}>
            {photo.url.endsWith(".mp4") || photo.url.endsWith(".webm") ? (
              <video
                controls
                src={photo.url}
                className=" h-full border-2 border-solid w-full rounded-lg object-contain"
              />
            ) : (
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className=" h-full border-2 border-solid w-full rounded-lg object-contain"
              />
            )}
          </SplideSlide>
        ))}
      </Splide>

      {/* Thumbnails */}
      <div className="thumbnails flex flex-wrap flex-none   mt-4 lg:mt-8 ">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`thumbnail w-16 h-16 lg:w-24 lg:h-24 overflow-hidden rounded-lg cursor-pointer ${
              currentIndex === index ? "border-2 border-blue-500" : "border"
            }`}
            onClick={() => mainCarouselRef.current?.go(index)}
          >
            {photo.url.endsWith(".mp4") || photo.url.endsWith(".webm") ? (
              <img
                src={
                 "/default-video-thumbnail.jpg"
                } /* Optional thumbnail for videos */
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={photo.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      
      </div>

    </div>
  );
};

export default ProfileGallery;
