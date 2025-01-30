import AdminLayout from "@/components/layouts/AdminLayout";
import DeailConsumptionPage from "@/components/partials/adminPartials/consumption/detail-consumption";

const DeailConsumption = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DeailConsumptionPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default DeailConsumption;