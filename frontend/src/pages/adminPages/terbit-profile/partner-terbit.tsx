import AdminLayout from "@/components/layouts/AdminLayout";
import PartnerTerbitPage from "@/components/partials/adminPartials/terbit-profile/partner-terbit";

const PartnerTerbit = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <PartnerTerbitPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default PartnerTerbit;