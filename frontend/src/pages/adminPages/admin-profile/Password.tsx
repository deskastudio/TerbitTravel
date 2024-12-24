import AdminLayout from "@/components/layouts/AdminLayout";
import PasswordPage from "@/components/partials/adminPartials/admin-profile/password";

const AdminPassword = () => {
    return (
        <>
        <AdminLayout>
            <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
                <PasswordPage />
            </div>
        </AdminLayout>
        </>
    )
}

export default AdminPassword;