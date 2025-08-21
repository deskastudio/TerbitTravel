import AdminLayout from "@/components/layouts/AdminLayout";
import EditTourPackagePage from "@/components/partials/adminPartials/tourPackage/edit-tour-package";

const EditTourPackage = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <EditTourPackagePage />
      </div>
    </AdminLayout>

    </>
  )
}

export default EditTourPackage;