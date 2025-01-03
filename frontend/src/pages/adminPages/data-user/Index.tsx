import AdminLayout from "@/components/layouts/AdminLayout";
import UserManagementPage from "@/components/partials/adminPartials/data-user/Index";

const UserManagement = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <UserManagementPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default UserManagement;