import { redirect } from "next/navigation";
import MultipleFileUpload from "~/app/_components/MultipleFileUpload";
import { getServerAuthSession } from "~/server/auth";
import GalleryView from "~/app/_components/GalleryView"
import FaqView from "~/app/_components/FaqView";
import EventView from "~/app/_components/EventView";
import AdminEmailUpdate from '~/app/_components/AdminEmailUpdate';
import AdminPasswordChange from '~/app/_components/AdminPasswordChange';
import ContactView from "~/app/_components/ContactView";
import PuppyManagement from "~/app/_components/PuppyManagement";

export default async function AdminDashboard() {

  const session = await getServerAuthSession();

  if (!session) {
    // Redirect to the login page if there is no session
    redirect("/admin/login");
    return null; // Stop further execution if redirecting
  }

  return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {session?.user?.email}</p>
        <MultipleFileUpload/>
        <GalleryView isAdmin={true} galleryType = "Main Gallery"/>
        <GalleryView isAdmin={true} galleryType = "Stud Gallery"/>
        <PuppyManagement isAdmin={true} />
        <EventView isAdmin={true}/>
        <FaqView isAdmin={true}/>
        <AdminEmailUpdate />
        <AdminPasswordChange />
        <ContactView isAdmin={true}/>
      </div>
  );
}
