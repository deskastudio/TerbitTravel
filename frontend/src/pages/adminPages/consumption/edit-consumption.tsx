import AdminLayout from "@/components/layouts/AdminLayout";
import EditConsumptionPage from "@/components/partials/adminPartials/consumption/edit-consumption";

const EditConsumption = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <EditConsumptionPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default EditConsumption;