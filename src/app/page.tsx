import GalleryView from "~/app/_components/GalleryView"
import FaqView from "./_components/FaqView";
import PuppyManagement from "./_components/PuppyManagement";




export default async function Home() {

  return (
    <>
    <h1>Home</h1>
    <PuppyManagement isAdmin={false} />
    <GalleryView isAdmin={false} galleryType = "Main Gallery"/>
    <GalleryView isAdmin={false} galleryType = "Stud Gallery"/>
    <FaqView isAdmin={false}/>
    </>
  
    
  );
}
