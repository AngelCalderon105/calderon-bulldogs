import Image from 'next/image';
import PuppyImage from "../../../public/PuppyImage.png";
import Paws from "../../../public/paws.png";

export default function AvailablePuppies() {
  return (
    <div className='bg-gradient-to-b from-blue-100 to-blue-200 '>
        <h1 className=" text-2xl font-bold text-blue-900 mb-6 z-10 text-center pt-10 md:pt-32 md:pr-60 md:text-4xl lg:text-5xl lg:flex lg:pl-40 lg:pt-40">
        Available Puppies
      </h1>
    <div className=" flex flex-col items-center justify-center md:items-end lg:mr-20 ">

     <div className='flex items-end justify-end '>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
      
        <div className="absolute top-36 left-1 sm:left-10 md:left-[400px] md:top-60 xl:top-[350px] 2xl:top-[500px] 2xl:left-[700px] opacity-90">
          <Image src={Paws} alt="Paw print" className='w-24 lg:w-36' />
        </div>
       
        <div className="absolute top-44 right-1 sm:right-10 md:top-72 lg:right-32 2xl:top-96  opacity-90 rotate-45">
          <Image src={Paws} alt="Paw print" className='w-20 lg:w-32 2xl:w-40' />
        </div>
      </div>

      <div className="z-10 w-full h-full lg:w-11/12">
        <Image
          src={PuppyImage}
          alt="Cute puppy image"
          className="w-[900px] md:w-[450px] lg:w-[700px] xl:w-[900px] 2xl:w-[1100px]"
        />
      </div>
    </div>
    </div>
    </div>
  );
}
