import MainGalleryView from "~/app/_components/MainGalleryView"
export default async function Home() {

  return (
    <>
    <h1>Home</h1>
    <MainGalleryView isAdmin={false}/>
    </>
  
    
  );
}
