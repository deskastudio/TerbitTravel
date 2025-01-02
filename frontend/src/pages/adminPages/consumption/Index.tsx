import AdminLayout from "@/components/layouts/AdminLayout";
import ConsumptionPage from "@/components/partials/adminPartials/consumption/Index";

const Consumption = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <ConsumptionPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default Consumption;