import MainGalleryView from "~/app/_components/MainGalleryView"
import FaqView from "./_components/FaqView";
import EventView from "./_components/EventView";
export default async function Home() {

  return (
    <>
    <h1>Home</h1>
    <MainGalleryView isAdmin={false}/>
    <FaqView isAdmin={false}/>
    <EventView/>
    </>
  
    
  );
}
