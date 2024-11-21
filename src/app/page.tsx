import GalleryView from "~/app/_components/GalleryView"
import FaqView from "./_components/FaqView";
import TestimonialView from "./_components/TestimonialView"
import ContactView from "./_components/ContactView"
import PuppyManagement from "./_components/PuppyManagement";
import EventView from "./_components/EventView";
export default async function Home() {

  return (
    <>
  
    <ContactView isAdmin={false} />
    </>
  
    
  );
}
