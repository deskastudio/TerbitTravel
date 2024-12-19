import AdminLayout from "@/components/layouts/AdminLayout";
import AddDestinationPage from "@/components/partials/adminPartials/destination/add-destination";
import { Toaster } from "@/components/ui/toaster";

const AddDestination = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <AddDestinationPage />
        <Toaster/>
      </div>
    </AdminLayout>

    </>
  )
}

export default AddDestination;