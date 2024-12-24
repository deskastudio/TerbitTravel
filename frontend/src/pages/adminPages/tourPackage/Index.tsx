import AdminLayout from "@/components/layouts/AdminLayout";
import TourPackagePage from "@/components/partials/adminPartials/tourPackage/Index";

const TourPackage = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <TourPackagePage />
      </div>
    </AdminLayout>

    </>
  )
}

export default TourPackage;