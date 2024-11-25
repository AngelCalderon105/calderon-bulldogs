import GalleryView from "~/app/_components/GalleryView"
import FaqView from "./_components/FaqView";
import TestimonialView from "./_components/TestimonialView"
import ContactView from "./_components/ContactView"
import PuppyManagement from "./_components/PuppyManagement";
import EventView from "./_components/EventView";
import PuppyAttributes from "./_components/PuppyAttributes"
export default async function Home() {

  return (
    <>
     <h1>Home</h1>
    <div className=" md:grid md:grid-cols-3 md:grid-rows-3 auto-rows-min">
      <PuppyAttributes value="item-1" triggerText= "Vet Wellness Exam" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/Health.svg"/>
      <PuppyAttributes value="item-2" triggerText= "Dry Food Trained" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/Food.svg"/>
      <PuppyAttributes value="item-3" triggerText= "Potty Trained" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/Paw.svg"/>
      <PuppyAttributes value="item-4" triggerText= "Puppy Starter Kit" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/Bone.svg"/>
      <PuppyAttributes value="item-5" triggerText= "Drinks Tap Water" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/Water.svg"/>
      <PuppyAttributes value="item-6" triggerText= "AKC Registered" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/Certificate.svg"/>
      <PuppyAttributes value="item-7" triggerText= "3 Rounds of DA2PP Vaccination" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/syringe.svg"/>
      <PuppyAttributes value="item-8" triggerText= "Gene Family Tree Certificate" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/tree.svg"/>
      <PuppyAttributes value="item-9" triggerText= "2 Deworming Treatements" contentText= "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vero alias iusto quis expedita possimus eius a error aperiam quibusdam. Sunt fuga eum repellat harum adipisci nemo reprehenderit quasi illum?" icon= "/dog.svg"/>
      </div>
       </>  

);
}
