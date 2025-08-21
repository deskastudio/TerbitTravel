import AdminLayout from "@/components/layouts/AdminLayout";
import DetailTourPackagePage from "@/components/partials/adminPartials/tourPackage/detail-tour-package";

const DetailTourPackage = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DetailTourPackagePage />
      </div>
    </AdminLayout>

    </>
  )
}

export default DetailTourPackage;