// pages/admin/banner/Edit.tsx
import AdminLayout from "@/components/layouts/AdminLayout";
import BannerFormPage from "@/components/partials/adminPartials/banner/form";

const BannerEdit = () => {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <BannerFormPage />
      </div>
    </AdminLayout>
  );
};

export default BannerEdit;
