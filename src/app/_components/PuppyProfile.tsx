import { PersonalityTrait } from '@prisma/client';
import React from 'react'
import GalleryView from "~/app/_components/GalleryView"
import WhiteButton from './WhiteButton';
import BlueButton from './BlueButton';
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
  
  const PuppyProfile: React.FC<PuppyProfileProps> = ({ puppy, isAdmin, onDelete }) => {
    const formattedName = (puppy.name || "").toLowerCase().replace(/\s+/g, "_") + "_gallery";
  
    const { data: photoData, isLoading, error } = api.s3.getLatestPhoto.useQuery(
      { folder: "puppy_galleries", subfolder: formattedName },
      { enabled: !!formattedName } 
    );
  
    // Safely access the photo
    const photo = photoData?.photo;
  
    return (
      <div className="border rounded-lg bg-gradient-to-r from-[#C2D7FB] via-[#EDF4FF] to-[#C5DAFF] shadow-md">
        <div>

        {isLoading ? (
          <div className=" w-full bg-gray-200 animate-pulse rounded-lg" />
        ) : error ?? !photo ? (
          <div className="w-full bg-gray-100 flex items-center justify-center text-gray-600 rounded-lg">
            No photo available
          </div>
        ) : (
          <img
          src={photo.url}
          alt={`${puppy.name}'s latest photo`}
          className="w-full rounded-lg rounded-b-none h-72 object-cover"
          />
        )}
        </div>
        {/* Bottom of Card */}
        <div className='p-4 '>

  
        <div className=" flex justify-between ">
          <span className='text-xl font-semibold '>
            {puppy.name}
            </span>
            <span className={puppy.status == "Sold" ? "text-designred" :"text-designblue"  }>
              {puppy.status}
            </span>
            </div>
        <span>

        <p className='my-1 font-light'>
          {puppy.sex}
          &nbsp;
          •     
          &nbsp;     
            {(() => {
              const birthDate = new Date(puppy.birthdate);
              const today = new Date();
              
              const diffInDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
              
              
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
            
            })(

            ) 
            }
                          
      
        
        </p>
            </span>
            <div className='flex justify-between  items-baseline flex-none'>

            <div className=' flex '>
            {puppy.personality.map((item)=>(
              <WhiteButton text = {item} key={item}/>
            ))
          }
            </div>
            <BlueButton text = "View Puppy"/>
          </div>
  
        {isAdmin && onDelete && (
          <button onClick={onDelete} className="bg-red-500 text-white px-2  mt-5 py-1 rounded">
            Delete Puppy
          </button>
        )}
        </div>
      </div>
    );
  };
  
  export default PuppyProfile;
  