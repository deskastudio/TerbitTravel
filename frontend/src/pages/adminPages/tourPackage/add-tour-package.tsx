import AdminLayout from "@/components/layouts/AdminLayout";
import AddTourPackagePage from "@/components/partials/adminPartials/tourPackage/add-tour-package";

const AddTourPackage = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <AddTourPackagePage />
      </div>
    </AdminLayout>

    </>
  )
}

export default AddTourPackage;