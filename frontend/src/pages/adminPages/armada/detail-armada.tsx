import AdminLayout from "@/components/layouts/AdminLayout";
import DetailArmadaPage from "@/components/partials/adminPartials/armada/detail-armada";

const DetailArmada = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <DetailArmadaPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default DetailArmada;