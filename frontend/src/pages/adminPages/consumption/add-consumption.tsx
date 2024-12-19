import AdminLayout from "@/components/layouts/AdminLayout";
import AddConsumptionPage from "@/components/partials/adminPartials/consumption/add-consumption";
import { Toaster } from "@/components/ui/toaster";

const AddConsumption = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <AddConsumptionPage />
        <Toaster/>
      </div>
    </AdminLayout>

    </>
  )
}

export default AddConsumption;