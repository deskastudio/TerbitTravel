import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/adminPages/dashboard/Index';
import AdminAllPackageTour from '../pages/adminPages/tourPackage/Index';
import AdminArticle from '../pages/adminPages/article/Index';
import AddDestination from '@/pages/adminPages/destination/add-destination';
import AddArmada from '@/pages/adminPages/armada/add-armada';
import AddConsumption from '@/pages/adminPages/consumption/add-consumption';
import AddHotel from '@/pages/adminPages/hotel/add-hotel';
import AddArticle from '@/pages/adminPages/article/add-article';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-all-package-tour" element={<AdminAllPackageTour />} />
      <Route path="/admin-article" element={<AdminArticle />} />
      <Route path="/admin-add-destination" element={<AddDestination />} />
      <Route path="/admin-add-armada" element={<AddArmada />} />
      <Route path="/admin-add-consumption" element={<AddConsumption />} />
      <Route path="/admin-add-hotel" element={<AddHotel />} />
      <Route path="/admin-add-article" element={<AddArticle />} />

    </Routes>
  );
}

export default AdminRoutes;
