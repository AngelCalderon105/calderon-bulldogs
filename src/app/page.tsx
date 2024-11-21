import GalleryView from "~/app/_components/GalleryView"
import FaqView from "./_components/FaqView";
import TestimonialView from "./_components/TestimonialView"
import ContactView from "./_components/ContactView"
import PuppyManagement from "./_components/PuppyManagement";
import EventView from "./_components/EventView";
export default async function Home() {

  return (
    <>
    <h1>Home</h1>
    <PuppyManagement isAdmin={false} />
    <GalleryView isAdmin={false} galleryType = "main_gallery" galleryName = "stud_gallery"/>
    <GalleryView isAdmin={false} galleryType = "main_gallery" galleryName = "mother_gallery"/>
    <GalleryView isAdmin={false} galleryType = "main_gallery" galleryName = "previous_litters_gallery"/>
    <GalleryView isAdmin={false} galleryType = "main_gallery" galleryName = "our_clients_gallery"/>
    <FaqView isAdmin={false}/>
    <EventView isAdmin={false}/>
    <TestimonialView isAdmin={false} />
    <ContactView isAdmin={false} />
    </>
  
    
  );
}
