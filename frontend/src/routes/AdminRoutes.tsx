import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/adminPages/dashboard/Index';
import AdminAllPackageTour from '../pages/adminPages/tourPackage/Index';
import AdminArticle from '../pages/adminPages/article/Index';
import AddDestination from '@/pages/adminPages/destination/add-destination';
import AddArmada from '@/pages/adminPages/armada/add-armada';
import AddConsumption from '@/pages/adminPages/consumption/add-consumption';
import AddHotel from '@/pages/adminPages/hotel/add-hotel';
import AddArticle from '@/pages/adminPages/article/add-article';
import DetailDestination from '@/pages/adminPages/destination/detail-destination';
import ProfilePage from '@/pages/adminPages/admin-profile/Profile';
import PasswordPage from '@/pages/adminPages/admin-profile/Password';
import AddTourPackage from '@/pages/adminPages/tourPackage/add-tour-package';
import EditTourPackage from '@/pages/adminPages/tourPackage/edit-tour-package';
import DetailTourPackage from '@/pages/adminPages/tourPackage/detail-tour-package';
import AdminAllDestination from '@/pages/adminPages/destination/Index';
import AdminAllArmada from '@/pages/adminPages/armada/Index';
import AdminAllConsumption from '@/pages/adminPages/consumption/Index';
import AdminAllHotel from '@/pages/adminPages/hotel/Index';
import AdminAllArticle from '@/pages/adminPages/article/Index';
import AdminAddArticle from '@/pages/adminPages/article/add-article';
import AdminAllUser from '@/pages/adminPages/data-user/Index';
import AdminAbout from '@/pages/adminPages/terbit-profile/about-terbit';
import AdminGallery from '@/pages/adminPages/terbit-profile/gallery-terbit';
import AdminLicences from '@/pages/adminPages/terbit-profile/licences-terbit';
import AdminPartner from '@/pages/adminPages/terbit-profile/partner-terbit';
import AdminTeam from '@/pages/adminPages/terbit-profile/team-terbit';
import AdminBanner from '@/pages/adminPages/terbit-profile/banner-terbit';
import AdminAllReview from '@/pages/adminPages/review/Index';
import AdminAllBookings from '@/pages/adminPages/booking/Index';


function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-all-package-tour" element={<AdminAllPackageTour />} />
      <Route path="/admin-all-destination" element={<AdminAllDestination />} />
      <Route path="/admin-all-armada" element={<AdminAllArmada />} />
      <Route path="/admin-all-consumption" element={<AdminAllConsumption />} />
      <Route path="/admin-all-hotel" element={<AdminAllHotel/>} />
      <Route path="/admin-all-article" element={<AdminAllArticle/>} />
      <Route path="/admin-add-article" element={<AdminAddArticle/>} />
      <Route path="/admin-all-review" element={<AdminAllReview/>} />  
      <Route path="/admin-all-bookings" element={<AdminAllBookings/>} />  
      <Route path="/admin-all-user" element={<AdminAllUser/>} />
      <Route path="/admin-article" element={<AdminArticle />} />
      <Route path="/admin-add-destination" element={<AddDestination />} />
      <Route path="/admin-add-armada" element={<AddArmada />} />
      <Route path="/admin-add-consumption" element={<AddConsumption />} />
      <Route path="/admin-add-hotel" element={<AddHotel />} />
      <Route path="/admin-add-article" element={<AddArticle />} />
      <Route path="/admin-detail-destination" element={<DetailDestination />} />
      <Route path="/admin-profile" element={<ProfilePage />} />
      <Route path="/admin-password" element={<PasswordPage />} />
      <Route path="/admin-add-package-tour" element={<AddTourPackage />} />
      <Route path="/admin-edit-package-tour/:id/edit" element={<EditTourPackage />} />
      <Route path="/admin-detail-package-tour/:id" element={<DetailTourPackage />} />


      <Route path="/admin-about" element={<AdminAbout/>} />
      <Route path="/admin-gallery" element={<AdminGallery/>} />
      <Route path="/admin-licences" element={<AdminLicences/>} />
      <Route path="/admin-partner" element={<AdminPartner/>} />
      <Route path="/admin-team" element={<AdminTeam />} />
      <Route path="/admin-banner" element={<AdminBanner/>} />

    </Routes>
  );
}

export default AdminRoutes;
