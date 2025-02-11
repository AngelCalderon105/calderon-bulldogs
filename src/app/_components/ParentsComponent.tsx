import Image from "next/image";
import { StaticImageData } from "next/image";
import CocoMother from "~/../public/cocoMother.webp";
import KratosFather from "~/../public/kratosFather.jpg";
import BirthdayCake from "~/../public/birthdayCake.svg";

interface ParentProps {
  coverImage: StaticImageData;
  name: string;
  breed: string;
  age: string;
  color: string;
}

const ParentCard: React.FC<{ parent: ParentProps }> = ({ parent }) => {
  return (
    <div className="parent-card flex w-full flex-col items-center px-4 md:w-1/2 md:items-start">
      {/* Image Section */}

      <Image
        src={parent.coverImage}
        alt={`${parent.name}`}
        className="h-60 w-full rounded-lg object-cover object-center md:h-96"
      />

      {/* Details Section */}
      <div className="mt-4 flex w-full flex-col space-y-2">
        {/* Name Section */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="font-sans text-[20px] font-bold text-blue_darker md:text-[22px] lg:text-[24px]">
            {parent.name == "Mother" ? "Coco" : "Kratos"}{" "}
          </h1>
          <span className="font-sans text-[16px] text-blue_darker md:text-[18px] lg:text-[20px]">
            {parent.name}
          </span>
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="font-sans text-blue_darker">
            <strong>Breed:</strong>{" "}
            <span className="font-normal">{parent.breed}</span>
          </p>
          <p className="flex items-center font-sans text-blue_darker">
            <img
              src="/birthdayCake.svg"
              alt="Age Icon"
              className="mr-2 h-5 w-5"
            />
            <span>{parent.age} years old</span>
          </p>
        </div>
        <p className="font-sans text-blue_darker">
          <strong>Color Variation:</strong>{" "}
          <span className="font-normal">{parent.color}</span>
        </p>
      </div>
    </div>
  );
};

const ParentsView: React.FC = () => {
  const mother = {
    coverImage: CocoMother,
    name: "Mother",
    breed: "English Bulldog",
    age: "5",
    color: "Black Tri",
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
      <h1 className="mb-8 mt-4 text-center font-georgia text-2xl text-[24px] font-bold md:mt-8 md:text-[32px] lg:mb-16 lg:mt-16 lg:text-[40px]">
        Meet the Parents
      </h1>
      <div className="mx-auto flex max-w-screen-xl flex-col justify-center gap-8 md:flex-row md:justify-between">
        <ParentCard parent={mother} />
        <ParentCard parent={father} />
      </div>
    </div>
  );
};

export default ParentsView;
