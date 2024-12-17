import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/adminPages/dashboard/Index';
import AllPackageTour from '../pages/adminPages/tourPackage/Index';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/all-package-tour" element={<AllPackageTour />} />
    </Routes>
  );
}

export default AdminRoutes;
