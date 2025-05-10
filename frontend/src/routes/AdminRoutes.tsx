import { Routes, Route } from 'react-router-dom';

import AdminDashboard from '@/pages/adminPages/dashboard/Index';
import AdminAllPackageTour from '@/pages/adminPages/tourPackage/Index';
import AddPackageTour from '@/pages/adminPages/tourPackage/add-tour-package';
import AddDestination from '@/pages/adminPages/destination/add-destination';
import AddArmada from '@/pages/adminPages/armada/add-armada';
import AddConsumption from '@/pages/adminPages/consumption/add-consumption';
import AddHotel from '@/pages/adminPages/hotel/add-hotel';
import AddArticle from '@/pages/adminPages/article/add-article';
import DetailDestination from '@/pages/adminPages/destination/detail-destination';
import ProfilePage from '@/pages/adminPages/admin-profile/Profile';
import PasswordPage from '@/pages/adminPages/admin-profile/Password';
import AdminAllDestination from '@/pages/adminPages/destination/Index';
import AdminAllArmada from '@/pages/adminPages/armada/Index';
import AdminAllConsumption from '@/pages/adminPages/consumption/Index';
import AdminAllHotel from '@/pages/adminPages/hotel/Index';
import AdminAllArticle from '@/pages/adminPages/article/Index';
import AdminAllUser from '@/pages/adminPages/data-user/Index';
import AdminAbout from '@/pages/adminPages/terbit-profile/about-terbit';
import AdminGallery from '@/pages/adminPages/terbit-profile/gallery-terbit';
import AdminLicences from '@/pages/adminPages/terbit-profile/licences-terbit';
import AdminPartner from '@/pages/adminPages/terbit-profile/partner-terbit';
import AdminTeam from '@/pages/adminPages/terbit-profile/team-terbit';
import AdminBanner from '@/pages/adminPages/terbit-profile/banner-terbit';
import DetailHotel from '@/pages/adminPages/hotel/detail-hotel';
import EditHotel from '@/pages/adminPages/hotel/edit-hotel';
import DetailConsumption from '@/pages/adminPages/consumption/detail-consumption';
import EditConsumption from '@/pages/adminPages/consumption/edit-consumption';
import DetailArmada from '@/pages/adminPages/armada/detail-armada';
import EditArmada from '@/pages/adminPages/armada/edit-armada';
import EditDestination from '@/pages/adminPages/destination/edit-destination';
import DetailPackageTour from '@/pages/adminPages/tourPackage/detail-tour-package';
import EditPackageTour from '@/pages/adminPages/tourPackage/edit-tour-package';


function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/admin/paket-wisata" element={<AdminAllPackageTour />} />
      <Route path="/admin/paket-wisata/add" element={<AddPackageTour />} />
      <Route path="/admin/paket-wisata/:id" element={<DetailPackageTour />} />
      <Route path="/admin/paket-wisata/:id/edit" element={<EditPackageTour />} />

      <Route path="/admin/hotel" element={<AdminAllHotel/>} />
      <Route path="/admin/hotel/add" element={<AddHotel />} />
      <Route path="/admin/hotel/:id" element={<DetailHotel />} />
      <Route path="/admin/hotel/:id/edit" element={<EditHotel />} />

      <Route path="/admin/consumption" element={<AdminAllConsumption/>} />
      <Route path="/admin/consumption/add" element={<AddConsumption />} />
      <Route path="/admin/consumption/:id" element={<DetailConsumption />} />
      <Route path="/admin/consumption/:id/edit" element={<EditConsumption />} />

      <Route path="/admin/armada" element={<AdminAllArmada/>} />
      <Route path="/admin/armada/add" element={<AddArmada />} />
      <Route path="/admin/armada/:id" element={<DetailArmada />} />
      <Route path="/admin/armada/:id/edit" element={<EditArmada />} />

      <Route path="/admin/destination" element={<AdminAllDestination/>} />
      <Route path="/admin/destination/add" element={<AddDestination />} />
      <Route path="/admin/destination/:id" element={<DetailDestination />} />
      <Route path="/admin/destination/:id/edit" element={<EditDestination />} /> 

      <Route path="/admin/article" element={<AdminAllArticle/>} />
      <Route path="/admin/article/add" element={<AddArticle />} />
      {/* <Route path="/admin/artikel/:id" element={<DetailArticle />} />
      <Route path="/admin/artikel/:id/edit" element={<EditArticle />} /> */}

      <Route path="/admin/user" element={<AdminAllUser />} />
      {/* <Route path="/admin/user/:id" element={<DetailUser />} />
      <Route path="/admin/user/:id/edit" element={<EditUser />} />  */}

      {/* <Route path="/admin/testimoni" element={<AdminAllTestimoni />} />
      <Route path="/admin/testimoni/add" element={<AddTestimoni />} />
      <Route path="/admin/testimoni/:id" element={<DetailTestimoni />} />
      <Route path="/admin/testimoni/:id/edit" element={<EditTestimoni />} /> */}
      
      <Route path="/admin-profile" element={<ProfilePage />} />
      <Route path="/admin-password" element={<PasswordPage />} />


      <Route path="/admin/tentang-terbit" element={<AdminAbout/>} />
      <Route path="/admin/galeri-terbit" element={<AdminGallery/>} />
      <Route path="/admin/lisensi-terbit" element={<AdminLicences/>} />
      <Route path="/admin/partner-terbit" element={<AdminPartner/>} />
      <Route path="/admin/tim-terbit" element={<AdminTeam />} />
      <Route path="/admin/banner-terbit" element={<AdminBanner/>} />

    </Routes>
  );
}

export default AdminRoutes;
