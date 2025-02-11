import { PersonalityTrait } from "@prisma/client";
import React from "react";
import GalleryView from "~/app/_components/GalleryView";
import WhiteButton from "./WhiteButton";
import BlueButton from "./BlueButton";
import { api } from "~/trpc/react";

interface PuppyType {
  id: number;
  name: string;
  birthdate: Date;
  color: string;
  status: string;
  price: number;
  sex: "Male" | "Female" | "Non_Specified";
  personality: PersonalityTrait[];
}

interface PuppyProfileProps {
  puppy: PuppyType;
  isAdmin: boolean;
  onDelete?: () => void;
}
interface PuppyProfileCardProps {
  puppy: {
    name: string;
  };
}

const PuppyProfile: React.FC<PuppyProfileProps> = ({
  puppy,
  isAdmin,
  onDelete,
}) => {
  const formattedName =
    (puppy.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery";

  const {
    data: photoData,
    isLoading,
    error,
  } = api.s3.getLatestPhoto.useQuery(
    { folder: "puppy_galleries", subfolder: formattedName },
    { enabled: !!formattedName },
  );

  // Safely access the photo
  const photo = photoData?.photo;

  return (
    <div className="rounded-lg border bg-gradient-to-r from-[#C2D7FB] via-[#EDF4FF] to-[#C5DAFF] shadow-md">
      <div>
        {isLoading ? (
          <div className="w-full animate-pulse rounded-lg bg-gray-200" />
        ) : (error ?? !photo) ? (
          <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            No photo available
          </div>
        ) : (
          <img
            src={photo.url}
            alt={`${puppy.name}'s latest photo`}
            className="h-72 w-full rounded-lg rounded-b-none object-cover"
          />
        )}
      </div>
      {/* Bottom of Card */}
      <div className="p-4">
        <div className="flex justify-between">
          <span className="text-xl font-semibold">{puppy.name}</span>
          <span
            className={
              puppy.status == "Sold" ? "text-designred" : "text-designblue"
            }
          >
            {puppy.status}
          </span>
        </div>
        <span>
          <p className="my-1 font-light">
            {puppy.sex}
            &nbsp; • &nbsp;
            {(() => {
              const birthDate = new Date(puppy.birthdate);
              const today = new Date();

              const diffInDays = Math.floor(
                (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24),
              );

              if (diffInDays < 7) {
                return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} old`; // Less than 7 days
              } else if (diffInDays < 28) {
                const weeks = Math.floor(diffInDays / 7);
                return `${weeks} week${weeks !== 1 ? "s" : ""} old`; // 1 to 4 weeks
              } else {
                const months = Math.floor(diffInDays / 30); // Approximate 1 month = 30 days
                if (months === 0) {
                  return `1 month old`; // Prevent "0 months old"
                }
                return `${months} month${months !== 1 ? "s" : ""} old`; // 1 month or more
              }
            })()}
          </p>
        </span>
        <div className="flex flex-none items-baseline justify-between">
          <div className="flex">
            {puppy.personality.map((item) => (
              <WhiteButton text={item} key={item} />
            ))}
          </div>
          <BlueButton text="View Puppy" />
        </div>

        {isAdmin && onDelete && (
          <button
            onClick={onDelete}
            className="mt-5 rounded bg-red-500 px-2 py-1 text-white"
          >
            Delete Puppy
          </button>
        )}
      </div>
    </div>
  );
};

export default PuppyProfile;
