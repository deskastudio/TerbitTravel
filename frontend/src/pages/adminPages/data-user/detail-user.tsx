import AdminLayout from "@/components/layouts/AdminLayout";
import DetailUserPage from "@/components/partials/adminPartials/data-user/detail-user";

const DetailUser = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DetailUserPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default DetailUser;