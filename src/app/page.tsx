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
  
    <div id="home">
      <HomeView isAdmin={false}/>
    </div>
    
    <div id="available_puppies">
      <PuppyManagement isAdmin={false} />
    </div>
    
    <div id="stud_service">
      <StudServiceCard /> 
    </div>

    <div id="faq" className="mx-6 sm:mx-10 md:mx-16 lg:mx-20 xl:mx-32 2xl:mx-40">
      <FaqView isAdmin={false}/>
    </div>

    <EventView isAdmin={false}/>
      <div id="contact">
        <ContactView isAdmin={false} />
      </div>

  <div className="m-2 my-20 lg:mt-10 lg:mb-20 lg:mx-10">
  <Footer />
 </div>
     </>
  );
}
