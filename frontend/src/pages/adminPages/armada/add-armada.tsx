import AdminLayout from "@/components/layouts/AdminLayout";
import AddArmadaPage from "@/components/partials/adminPartials/armada/add-armada";
import { Toaster } from "@/components/ui/toaster";

const AddArmada = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <AddArmadaPage />
        <Toaster/>
      </div>
    </AdminLayout>

    </>
  )
}

export default AddArmada;