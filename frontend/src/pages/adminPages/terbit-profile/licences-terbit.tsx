import AdminLayout from "@/components/layouts/AdminLayout";
import LicencesTerbitPage from "@/components/partials/adminPartials/terbit-profile/licences-terbit";

const LicencesTerbit = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <LicencesTerbitPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default LicencesTerbit;