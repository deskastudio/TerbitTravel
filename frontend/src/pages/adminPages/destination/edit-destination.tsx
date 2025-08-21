import AdminLayout from "@/components/layouts/AdminLayout";
import EditDestinationPage from "@/components/partials/adminPartials/destination/edit-destination";

const EditDestination = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <EditDestinationPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default EditDestination;