import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/adminPages/dashboard/Index';
import AdminAllPackageTour from '../pages/adminPages/tourPackage/Index';
import AdminArticle from '../pages/adminPages/article/Index';


function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-all-package-tour" element={<AdminAllPackageTour />} />
      <Route path="/admin-article" element={<AdminArticle />} />
    </Routes>
  );
}

export default AdminRoutes;
