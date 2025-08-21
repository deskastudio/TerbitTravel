import AdminLayout from "@/components/layouts/AdminLayout";
import BannerTerbitPage from "@/components/partials/adminPartials/terbit-profile/banner-terbit";

const BannerTerbit = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <BannerTerbitPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default BannerTerbit;