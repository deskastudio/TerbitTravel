import AdminLayout from "@/components/layouts/AdminLayout";
import DashboardPage from "@/components/partials/adminPartials/dashboard/Index";

const Dashboard = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DashboardPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default Dashboard;