import MainGalleryView from "~/app/_components/MainGalleryView"
import FaqView from "./_components/FaqView";
import ContactView from "./_components/ContactView"
export default async function Home() {

  return (
    <>
    <h1>Home</h1>
    <MainGalleryView isAdmin={false}/>
    <FaqView isAdmin={false}/>
    <ContactView isAdmin={false} />
    </>
  
    
  );
}
