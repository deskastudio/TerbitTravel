import { Routes, Route } from 'react-router-dom';
import Homepage from '../pages/mainPages/homepage/Index';
import Login from '../pages/login/Index';
import Register from '../pages/register/Index';
import Profile from '../pages/mainPages/profile/Index';
import Article from '@/pages/mainPages/article/Index';
import TourPackage from '@/pages/mainPages/tourPackage/Index';
import Destination from '@/pages/mainPages/destination/Index';
import ForgotPassword from '@/pages/forgotPassword/Index';
import TourPackageDetails from '@/pages/mainPages/tourPackage/DetailPackage';

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/article" element={<Article />} />
      <Route path="/tour-package" element={<TourPackage />} />
      <Route path="/tour-packages/:id" element={<TourPackageDetails />} />
      <Route path="/destination" element={<Destination />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default MainRoutes;
