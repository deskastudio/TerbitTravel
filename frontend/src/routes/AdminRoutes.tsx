// src/routes/AdminRoutes.tsx
import { Routes, Route } from "react-router-dom";
import AdminProtectedRoute from "@/components/partials/adminPartials/adminProtect/Index";
import AdminLogin from "@/pages/adminPages/auth/Index";

// Import semua admin pages
import AdminDashboard from "@/pages/adminPages/dashboard/Index";
import AdminAllPackageTour from "@/pages/adminPages/tourPackage/Index";
import AddPackageTour from "@/pages/adminPages/tourPackage/add-tour-package";
import AddDestination from "@/pages/adminPages/destination/add-destination";
import AddArmada from "@/pages/adminPages/armada/add-armada";
import AddConsumption from "@/pages/adminPages/consumption/add-consumption";
import AddHotel from "@/pages/adminPages/hotel/add-hotel";
import AddArticle from "@/pages/adminPages/article/add-article";
import DetailDestination from "@/pages/adminPages/destination/detail-destination";
import ProfilePage from "@/pages/adminPages/admin-profile/Profile";
import PasswordPage from "@/pages/adminPages/admin-profile/Password";
import AdminAllDestination from "@/pages/adminPages/destination/Index";
import AdminAllArmada from "@/pages/adminPages/armada/Index";
import AdminAllConsumption from "@/pages/adminPages/consumption/Index";
import AdminAllHotel from "@/pages/adminPages/hotel/Index";
import AdminAllArticle from "@/pages/adminPages/article/Index";
import AdminAllUser from "@/pages/adminPages/data-user/Index";
import DetailUser from "@/pages/adminPages/data-user/detail-user";
import AdminAbout from "@/pages/adminPages/terbit-profile/about-terbit";
import AdminGallery from "@/pages/adminPages/terbit-profile/gallery-terbit";
import AdminLicences from "@/pages/adminPages/terbit-profile/licences-terbit";
import AdminPartner from "@/pages/adminPages/terbit-profile/partner-terbit";
import AdminTeam from "@/pages/adminPages/terbit-profile/team-terbit";
import AdminBanner from "@/pages/adminPages/banner/Index";
import DetailHotel from "@/pages/adminPages/hotel/detail-hotel";
import EditHotel from "@/pages/adminPages/hotel/edit-hotel";
import DetailConsumption from "@/pages/adminPages/consumption/detail-consumption";
import EditConsumption from "@/pages/adminPages/consumption/edit-consumption";
import DetailArmada from "@/pages/adminPages/armada/detail-armada";
import EditArmada from "@/pages/adminPages/armada/edit-armada";
import EditDestination from "@/pages/adminPages/destination/edit-destination";
import DetailPackageTour from "@/pages/adminPages/tourPackage/detail-tour-package";
import EditPackageTour from "@/pages/adminPages/tourPackage/edit-tour-package";
import BannerAdd from "@/pages/adminPages/banner/Add";
import EditBanner from "@/pages/adminPages/banner/Edit";

import AdminAllBooking from "@/pages/adminPages/booking/Index";
import DetailBooking from "@/pages/adminPages/booking/detail-booking";

// Import Article Detail and Edit pages
import DetailArticle from "@/pages/adminPages/article/detail-article";
import EditArticle from "@/pages/adminPages/article/edit-article";

function AdminRoutes() {
  console.log("🔄 AdminRoutes rendered");

  return (
    <Routes>
      {/* ✅ FIXED: Login route is now using a relative path */}
      <Route path="login" element={<AdminLogin />} />

      {/* ✅ FIXED: All other admin routes use relative paths and are properly nested */}
      <Route
        path="/*"
        element={
          <AdminProtectedRoute>
            <Routes>
              {/* ✅ Dashboard */}
              <Route path="dashboard" element={<AdminDashboard />} />

              {/* ✅ Tour Package Management */}
              <Route path="paket-wisata" element={<AdminAllPackageTour />} />
              <Route path="paket-wisata/add" element={<AddPackageTour />} />
              <Route path="paket-wisata/:id" element={<DetailPackageTour />} />
              <Route
                path="paket-wisata/:id/edit"
                element={<EditPackageTour />}
              />

              {/* ✅ Hotel Management */}
              <Route path="hotel" element={<AdminAllHotel />} />
              <Route path="hotel/add" element={<AddHotel />} />
              <Route path="hotel/:id" element={<DetailHotel />} />
              <Route path="hotel/:id/edit" element={<EditHotel />} />

              {/* ✅ Consumption Management */}
              <Route path="consumption" element={<AdminAllConsumption />} />
              <Route path="consumption/add" element={<AddConsumption />} />
              <Route path="consumption/:id" element={<DetailConsumption />} />
              <Route
                path="consumption/:id/edit"
                element={<EditConsumption />}
              />

              {/* ✅ Fleet Management */}
              <Route path="armada" element={<AdminAllArmada />} />
              <Route path="armada/add" element={<AddArmada />} />
              <Route path="armada/:id" element={<DetailArmada />} />
              <Route path="armada/:id/edit" element={<EditArmada />} />

              {/* ✅ Destination Management */}
              <Route path="destination" element={<AdminAllDestination />} />
              <Route path="destination/add" element={<AddDestination />} />
              <Route path="destination/:id" element={<DetailDestination />} />
              <Route
                path="destination/:id/edit"
                element={<EditDestination />}
              />

              <Route path="booking" element={<AdminAllBooking />} />
              <Route path="booking/:id" element={<DetailBooking />} />

              {/* ✅ Article Management - UPDATED WITH DETAIL AND EDIT */}
              <Route path="article" element={<AdminAllArticle />} />
              <Route path="article/add" element={<AddArticle />} />
              <Route path="article/:id" element={<DetailArticle />} />
              <Route path="article/:id/edit" element={<EditArticle />} />

              {/* ✅ Banner Management */}
              <Route path="banner" element={<AdminBanner />} />
              <Route path="banner/add" element={<BannerAdd />} />
              <Route path="banner/:id/edit" element={<EditBanner />} />

              {/* ✅ User Management */}
              <Route path="user" element={<AdminAllUser />} />
              <Route path="user/:id" element={<DetailUser />} />

              {/* ✅ Company Profile Management */}
              <Route path="tentang-terbit" element={<AdminAbout />} />
              <Route path="galeri-terbit" element={<AdminGallery />} />
              <Route path="lisensi-terbit" element={<AdminLicences />} />
              <Route path="partner-terbit" element={<AdminPartner />} />
              <Route path="tim-terbit" element={<AdminTeam />} />

              {/* ✅ Profile Management */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="password" element={<PasswordPage />} />
            </Routes>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AdminRoutes;
