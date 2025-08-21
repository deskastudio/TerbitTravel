
// pages/admin/banner/Index.tsx
import AdminLayout from "@/components/layouts/AdminLayout";
import BannerPage from "@/components/partials/adminPartials/banner/Index";

const Banner = () => {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <BannerPage />
      </div>
    </AdminLayout>
  );
};

export default Banner;