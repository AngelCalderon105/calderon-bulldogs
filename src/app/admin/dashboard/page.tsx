import { redirect } from "next/navigation";
import MultipleFileUpload from "~/app/_components/MultipleFileUpload";
import { getServerAuthSession } from "~/server/auth";
import TestimonialView from "~/app/_components/TestimonialView";
import GalleryView from "~/app/_components/GalleryView"
import FaqView from "~/app/_components/FaqView";
import EventView from "~/app/_components/EventView";
import AdminEmailUpdate from '~/app/_components/AdminEmailUpdate';
import AdminPasswordChange from '~/app/_components/AdminPasswordChange';
import ContactView from "~/app/_components/ContactView";
import PuppyManagement from "~/app/_components/PuppyManagement";
import AvailabilityForm from "~/app/_components/AvailabilityForm";

export default async function AdminDashboard() {

  const session = await getServerAuthSession();

  if (!session) {
    // Redirect to the login page if there is no session
    redirect("/admin/login");
    return null; // Stop further execution if redirecting
  }
  console.log("Session:", session);

  return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {session?.user?.email}</p>

        <AvailabilityForm />

        <PuppyManagement isAdmin={true} />


        <EventView isAdmin={true}/>
        <FaqView isAdmin={true}/>
        <ContactView isAdmin={true}/>
       
        <AdminEmailUpdate />
        <AdminPasswordChange />
        {/*<MultipleFileUpload galleryType = "main_gallery"/>
       <GalleryView isAdmin={true} galleryType = "main_gallery" galleryName = "previous_litters_gallery"/>
       <GalleryView isAdmin={true} galleryType = "main_gallery" galleryName = "stud_gallery"/>
       <GalleryView isAdmin={true} galleryType = "main_gallery" galleryName = "mother_gallery"/>
       <TestimonialView isAdmin={true} />
       <GalleryView isAdmin={true} galleryType = "main_gallery" galleryName = "our_clients_gallery"/> */}
      </div>
  );
}
