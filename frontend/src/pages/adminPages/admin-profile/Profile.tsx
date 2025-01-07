import AdminLayout from "@/components/layouts/AdminLayout";
import ProfilePage from "@/components/partials/adminPartials/admin-profile/profile";

const AdminProfile = () => {
    return (
        <>
        <AdminLayout>
            <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
                <ProfilePage />
            </div>
        </AdminLayout>
        </>
    )
}

export default AdminProfile;