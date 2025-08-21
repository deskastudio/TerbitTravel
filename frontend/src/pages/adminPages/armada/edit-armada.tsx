import AdminLayout from "@/components/layouts/AdminLayout";
import EditArmadaPage from "@/components/partials/adminPartials/armada/edit-armada";

const EditArmada = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <EditArmadaPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default EditArmada;