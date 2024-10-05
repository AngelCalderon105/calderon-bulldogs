import GalleryView from "~/app/_components/GalleryView"
import FaqView from "./_components/FaqView";
import ContactView from "./_components/ContactView"
import PuppyManagement from "./_components/PuppyManagement";
import EventView from "./_components/EventView";
export default async function Home() {

  return (
    <>
    <h1>Home</h1>
    <PuppyManagement isAdmin={false} />
    <GalleryView isAdmin={false} galleryType = "Main Gallery"/>
    <GalleryView isAdmin={false} galleryType = "Stud Gallery"/>
    <FaqView isAdmin={false}/>
    <EventView isAdmin={false}/>
    <ContactView isAdmin={false} />
    </>
  
    
  );
}
