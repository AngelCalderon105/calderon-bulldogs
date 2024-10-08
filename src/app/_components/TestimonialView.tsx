"use client";

import { ImageFile } from "aws-sdk/clients/iotsitewise";
import { useState } from "react";

interface TestimonialViewProps {
  isAdmin: boolean;
}

// type Rating =
//   | "ONE"
//   | "ONE_HALF"
//   | "TWO"
//   | "TWO_HALF"
//   | "THREE"
//   | "THREE_HALF"
//   | "FOUR"
//   | "FOUR_HALF"
//   | "FIVE";

// const ratingValues: { [key: string]: Rating } = {
//   "1": "ONE",
//   "1.5": "ONE_HALF",
//   "2": "TWO",
//   "2.5": "TWO_HALF",
//   "3": "THREE",
//   "3.5": "THREE_HALF",
//   "4": "FOUR",
//   "4.5": "FOUR_HALF",
//   "5": "FIVE",
// };

type RatingValue = 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export default function TestimonialView({ isAdmin }: TestimonialViewProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [rating, setRating] = useState<RatingValue>(5);
  const [comment, setComment] = useState<string>("");
  const [fileList, setFileList] = useState<FileList | null>();

    const handleSubmitForm = () => {
        
    }

  return (
    <div className="mx-12 py-12">
      <h1 className="mb-4 font-bold">Testimonials</h1>
      {!isAdmin && (
        <div className="w-fit rounded-2xl border-2 border-gray-200 p-6">
          <h2 className="mb-4 font-medium">Submit Testimonial</h2>
          <p>Name</p>
          <input
            className="mb-4 rounded-xl border-2 border-gray-200 px-3 py-1"
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
                setRating(Number(e.target.value) as RatingValue);
              }}
              required
            />
            <p>{rating}/5</p>
          </div>

          <p>Comment</p>
          <input
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
            className="mb-4"
            onChange={(e) => {
              setFileList(e.target.files)
            }}
          />

          <div>
            <button
              className="rounded-2xl bg-green-500 px-4 py-2 text-lg font-medium text-white duration-100 hover:bg-green-700 disabled:bg-green-200"
              disabled={!name || !email || !rating || !comment}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
