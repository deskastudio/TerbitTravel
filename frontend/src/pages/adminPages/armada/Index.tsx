import AdminLayout from "@/components/layouts/AdminLayout";
import ArmadaPage from "@/components/partials/adminPartials/armada/Index";

const Armada = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <ArmadaPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default Armada;