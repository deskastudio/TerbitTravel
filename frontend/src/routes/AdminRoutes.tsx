import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/adminPages/dashboard/Index';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AdminRoutes;
