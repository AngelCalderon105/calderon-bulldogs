import GalleryView from "~/app/_components/GalleryView"
import FaqView from "./_components/FaqView";
import TestimonialView from "./_components/TestimonialView"
import ContactView from "./_components/ContactView"
import PuppyManagement from "./_components/PuppyManagement";
import EventView from "./_components/EventView";
import StudServiceCard from "./_components/StudService";
import HowItWorks from "./_components/Howitworks";
import Footer from "./_components/Footer"
import HomeView from "./_components/HomeView";
export default async function Home() {

  return (
    <>
  
    <HomeView isAdmin={false}/>
    <PuppyManagement isAdmin={false} />
    {/* <GalleryView isAdmin={false} galleryType = "main_gallery" galleryName = "stud_gallery"/>
    <GalleryView isAdmin={false} galleryType = "main_gallery" galleryName = "previous_litters_gallery"/>
    <GalleryView isAdmin={false} galleryType = "main_gallery" galleryName = "our_clients_gallery"/>
    <GalleryView isAdmin={false} galleryType = "main_gallery" galleryName = "our_clients_gallery"/> */
  }
    <StudServiceCard /> 

      <div className="mx-6 sm:mx-10 md:mx-16 lg:mx-20 xl:mx-32 2xl:mx-40">
    <FaqView isAdmin={false}/>
   </div>
    <EventView isAdmin={false}/>
    <ContactView isAdmin={false} />
    {/* <TestimonialView isAdmin={false} /> */}
    {/* <ContactView isAdmin={false} /> */}

  <div className="m-2 mb-20 lg:mx-10">
  <Footer />
 </div>
     </>
  );
}
