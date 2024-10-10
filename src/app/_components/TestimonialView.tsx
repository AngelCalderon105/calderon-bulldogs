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
  const {
    data: allTestimonials,
    isLoading,
    isError,
    refetch,
  } = api.testimonial.listAllTestimonials.useQuery();

  const createTestimonialMutation =
    api.testimonial.createNewTestimonial.useMutation();
  const presignedUrlMutation = api.s3.getPresignedUrl.useMutation();
  const deleteTestimonialMutation =
    api.testimonial.deleteTestimonial.useMutation();
  const deletePhotoMutation = api.s3.deletePhoto.useMutation();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [ratingNumber, setRatingNumber] = useState<RatingValue>(2.5);
  const [comment, setComment] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState<boolean>(false);

  const [deleteTestimonialConfirmation, setDeleteTestimonialConfirmation] =
    useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = async (file: File) => {
    try {
      const now = new Date();
      const isoString = now.toISOString();

      const uniqueFileName = `${isoString}${file.name}`;
      // Get the presigned URL for uploading
      const { presignedUrl, s3Url } = await presignedUrlMutation.mutateAsync({
        fileName: uniqueFileName,
        folderName: "testimonial_uploads",
        fileType: file.type,
        tags: [""],
      });

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });

      return s3Url;
    } catch (err) {
      console.error("Something went wrong while uploading your file:", err);
      return "";
    }
  };

  const handleSubmitForm = async () => {
    try {
      setUploading(true);
      const rating = ratingValues[ratingNumber] as
        | "ONE"
        | "ONE_HALF"
        | "TWO"
        | "TWO_HALF"
        | "THREE"
        | "THREE_HALF"
        | "FOUR"
        | "FOUR_HALF"
        | "FIVE";

      let photoUrl = "";
      if (imageFile != null) {
        photoUrl = await uploadFile(imageFile);
      }

      const newTestimonial = await createTestimonialMutation.mutateAsync({
        name,
        email,
        rating,
        comment,
        photoUrl,
      });
      setName("");
      setEmail("");
      setComment("");
      clearFile();
      setUploading(false);

      alert("Testimonial submitted successfully!");
    } catch (err) {
      console.error(
        "Something went wrong while submitting testimonial form:",
        err,
      );
      setUploading(false);
    }
  };

  const handleDeleteTestimonial: (
    testimonialId: string,
    photoKey: string | null,
  ) => React.MouseEventHandler<HTMLButtonElement> = (
    testimonialId,
    photoUrl,
  ) => {
    return async (e) => {
      try {
        if (photoUrl != null && photoUrl != "") {
          await deletePhotoMutation.mutateAsync({
            key: photoUrl.split("amazonaws.com/")[1] as string,
          });
        }
        await deleteTestimonialMutation.mutateAsync({ id: testimonialId });
        setDeleteTestimonialConfirmation(false);
        await refetch();
        alert("Testimonial deleted successfully.");
      } catch (err) {
        console.error("Something went wrong while deleting testimonial.");
      }
    };
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
          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            className="mb-4 h-32 w-80 rounded-xl border-2 border-gray-200 px-3 py-1 text-start"
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
                setImageFile(null);
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
        <div className="flex flex-wrap gap-3">
          {allTestimonials == undefined || allTestimonials.length == 0 ? (
            <p>No testimonials available</p>
          ) : null}
          {isLoading && <p>Loading testimonials...</p>}
          {allTestimonials?.map((testimonial) => {
            return (
              <div
                key={testimonial.id}
                className="flex w-fit flex-col gap-1 rounded-xl border-2 border-gray-200 p-4"
              >
                <h3 className="font-bold">{testimonial.name}</h3>
                <div>
                  <span className="underline underline-offset-2">Email</span>
                  <span>: {testimonial.email}</span>
                </div>
                <div>
                  <span className="underline underline-offset-2">Rating</span>
                  <span>: {testimonial.rating}</span>
                </div>
                <div>
                  <span className="underline underline-offset-2">Comment</span>
                  <span>: {testimonial.comment}</span>
                </div>

                <div className="mb-4">
                  {testimonial.photoUrl && (
                    <div>
                      <p>{testimonial.photoUrl}</p>
                      <img
                        src={testimonial.photoUrl}
                        alt={`Photo for testimonial ${testimonial.id} from ${testimonial.photoUrl}`}
                        className="mt-3 w-48 w-full rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex w-full justify-end gap-2">
                  {/* <button className="rounded-xl border-2 border-gray-500 bg-white px-4 py-1 text-gray-500 duration-200 hover:bg-gray-500 hover:text-white">
                    Edit
                  </button> */}
                  <button
                    onClick={() => setDeleteTestimonialConfirmation(true)}
                    className="rounded-xl bg-red-500 px-4 py-1 text-white duration-200 hover:bg-red-700 hover:text-white"
                  >
                    Delete
                  </button>
                </div>

                {deleteTestimonialConfirmation && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[350px] rounded-2xl bg-white p-6">
                      <h1 className="mb-3 text-2xl font-bold">Confirmation</h1>
                      <p className="mb-5">Are you sure?</p>
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-xl border-2 border-gray-500 px-4 py-1 text-gray-500 duration-200 hover:bg-gray-500 hover:text-white"
                          onClick={() =>
                            setDeleteTestimonialConfirmation(false)
                          }
                        >
                          Cancel
                        </button>
                        <button
                          className="rounded-xl bg-red-500 px-4 py-1 text-white hover:bg-red-700"
                          onClick={handleDeleteTestimonial(
                            testimonial.id,
                            testimonial.photoUrl,
                          )}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
