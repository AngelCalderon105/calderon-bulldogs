"use client";

import { useState, useRef } from "react";
import { api } from "~/trpc/react";

interface TestimonialViewProps {
  isAdmin: boolean;
}

const ratingValues: { [key: number]: any } = {
  1: "ONE",
  1.5: "ONE_HALF",
  2: "TWO",
  2.5: "TWO_HALF",
  3: "THREE",
  3.5: "THREE_HALF",
  4: "FOUR",
  4.5: "FOUR_HALF",
  5: "FIVE",
};

type RatingValue = 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export default function TestimonialView({ isAdmin }: TestimonialViewProps) {
  const { data: allTestimonials, isLoading, isError, refetch } = api.testimonial.listAllTestimonials.useQuery();
  
  const createTestimonialMutation = 
    api.testimonial.createNewTestimonial.useMutation();
  const presignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [ratingNumber, setRatingNumber] = useState<RatingValue>(2.5);
  const [comment, setComment] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState<boolean>(false);


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = async (file: File) => {
    try {

      const now = new Date()
      const isoString = now.toISOString();

      // Get the presigned URL for uploading
      const { presignedUrl } = await presignedUrlMutation.mutateAsync({
        fileName: `${isoString}${file.name}`,
        folderName: "testimonial_uploads",
        fileType: file.type,
        tags: [""]
      });

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });

      return presignedUrl;

    } catch (err) {
      console.error("Something went wrong while uploading your file:", err);
      return "";
    }
  };

  const handleSubmitForm = async () => {
    try {
      setUploading(true)
      const rating  = ratingValues[ratingNumber] as "ONE" | "ONE_HALF" | "TWO" | "TWO_HALF" | "THREE" | "THREE_HALF" | "FOUR" | "FOUR_HALF" | "FIVE"

      let photoUrl = ""
      if (imageFile != null) {
        photoUrl = await uploadFile(imageFile)
      }
      
      const newTestimonial = await createTestimonialMutation.mutateAsync({ name, email, rating, comment, photoUrl })
      setName("")
      setEmail("")
      setComment("")
      clearFile()
      setUploading(false)

      alert("Testimonial submitted successfully!")

    } catch (err) {
      console.error("Something went wrong while submitting testimonial form:", err)
      setUploading(false)
    }
    
  };

  const clearFile = () => {
    // Clear the state
    setImageFile(null);
    
    // Reset the input field
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  return (
    <div className="mx-12 py-12">
      <h1 className="mb-4 font-bold">Testimonials</h1>
      {!isAdmin && (
        <div className="w-fit rounded-2xl border-2 border-gray-200 p-6">
          <h2 className="mb-4 font-medium">Submit Testimonial</h2>
          <p>Name</p>
          <input
            className="mb-4 rounded-xl border-2 border-gray-200 px-3 py-1"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
          <p>Email</p>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            className="mb-4 rounded-xl border-2 border-gray-200 px-3 py-1"
            required
          />

          <p>Rating</p>
          <div className="flex gap-4">
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              onChange={(e) => {
                setRatingNumber(Number(e.target.value) as RatingValue);
              }}
              required
            />
            <p>{ratingNumber}/5</p>
          </div>

          <p>Comment</p>
          <input
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            className="mb-4 rounded-xl border-2 border-gray-200 px-3 py-1"
            required
          />

          <p>Photo upload</p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="mb-4"
            onChange={(e) => {
              if (e.target.files != null && e.target.files.length != 0) {
                setImageFile(e.target.files[0] as File);
              } else {
                setImageFile(null)
              }
            }}
          />

          <div>
            {uploading && <p>Uploading...</p>}
            {!uploading && (
              <button
              onClick={handleSubmitForm}
                className="rounded-2xl bg-green-500 px-4 py-2 text-lg font-medium text-white duration-100 hover:bg-green-700 disabled:bg-green-200"
                disabled={!name || !email || !ratingNumber || !comment}
              >
                Submit
              </button>
            )}
            
          </div>
        </div>
      )}

      {isAdmin && (
        <div>
          {isLoading && (
            <p>Loading testimonials...</p>
          )}
          {allTestimonials?.map((testimonial) => {
            // get photo

            return (
              <div className="p-4 border-2 rounded-xl border-gray-200 flex flex-col gap-1">
                <h3 className="font-bold">{testimonial.name}</h3>
                <div>
                  <span className="underline underline-offset-2">Email</span><span>: {testimonial.email}</span>
                </div>
                <div>
                  <span className="underline underline-offset-2">Rating</span><span>: {testimonial.rating}</span>
                </div>
                <div>
                  <span className="underline underline-offset-2">Comment</span><span>: {testimonial.comment}</span>
                </div>
                
                <div>
                  {testimonial.photoUrl}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
