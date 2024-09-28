import { redirect } from "next/navigation";
import MultipleFileUpload from "~/app/_components/MultipleFileUpload";
import { getServerAuthSession } from "~/server/auth";
import MainGalleryView from "~/app/_components/MainGalleryView"
import FaqView from "~/app/_components/FaqView";
import AdminEmailUpdate from '~/app/_components/AdminEmailUpdate';
import AdminPasswordChange from '~/app/_components/AdminPasswordChange';
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
        <MainGalleryView isAdmin={true}/>
        <FaqView isAdmin={true}/>
        <AdminEmailUpdate />
        <AdminPasswordChange />
      </div>
  );
}
