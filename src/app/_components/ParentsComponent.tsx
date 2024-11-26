import Image from "next/image";
import {StaticImageData} from "next/image";
import CocoMother from "~/../public/cocoMother.webp"
import KratosFather from "~/../public/kratosFather.jpg"
import BirthdayCake from "~/../public/birthdayCake.svg"

interface ParentProps {
    coverImage: StaticImageData;
    name: string;
    breed: string;
    age: string;
    color: string;
  }
  
  const ParentCard: React.FC<{ parent: ParentProps }> = ({ parent }) => {
    return (
      <div className="parent-card flex flex-col items-center md:items-start w-full md:w-1/2 px-4">
        {/* Image Section */}
        
        <Image
      src={parent.coverImage}
      alt={`${parent.name}`} 
      className="h-60 md:h-96  object-center w-full rounded-lg object-cover "

    />
         
        
  
        {/* Details Section */}
        <div className="flex flex-col mt-4 space-y-2 w-full">
          {/* Name Section */}
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-blue_darker font-bold font-sans text-[20px] md:text-[22px] lg:text-[24px]">{parent.name == "Mother" ? "Coco" :"Kratos"} </h1>
            <span className="font-sans text-blue_darker text-[16px] md:text-[18px] lg:text-[20px]">{parent.name}</span>

          </div> 
  
          <div className="flex flex-row justify-between items-center">
            <p className="font-sans text-blue_darker">
                <strong>Breed:</strong> <span className="font-normal">{parent.breed}</span>
            </p>
            <p className="font-sans text-blue_darker flex items-center">
                <img src="/birthdayCake.svg" alt="Age Icon" className="w-5 h-5 mr-2" />
                <span>{parent.age} years old</span>
            </p>
            </div>
          <p className="font-sans text-blue_darker">
            <strong>Color Variation:</strong> <span className="font-normal">{parent.color}</span>
          </p>
        </div>
      </div>
    );
  };
  
  const ParentsView: React.FC = () => {
    const mother = {
      coverImage: CocoMother,
      name: "Mother",
      breed: "Mini Bulldog",
      age: "2",
      color: "Lilac",
    };
  
    const father = {
      coverImage: KratosFather,
      name: "Father",
      breed: "Mini Bulldog",
      age: "2",
      color: "Lilac",
    };
  
    return (
      <div className="w-full py-8">
        <h1 className="text-2xl font-bold font-georgia text-center mt-4 md:mt-8 lg:mt-16 mb-8 lg:mb-16 text-[24px] md:text-[32px] lg:text-[40px]">Meet the Parents</h1>
        <div className="flex flex-col md:flex-row justify-center md:justify-between max-w-screen-xl mx-auto gap-8">
          <ParentCard parent={mother} />
          <ParentCard parent={father} />
        </div>
      </div>
    );
  };
  
  export default ParentsView;
  