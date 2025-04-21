import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './ProtectedRoutes';
// import authService from '../services/auth.service';

// Main Pages
import Homepage from '../pages/mainPages/homepage/Index';
import Profile from '../pages/mainPages/profile/Index';
import Article from '@/pages/mainPages/article/Index';
import TourPackage from '@/pages/mainPages/tourPackage/Index';
import Destination from '@/pages/mainPages/destination/Index';
import TourPackageDetails from '@/pages/mainPages/tourPackage/DetailPackage';
import TermsConditionsPage from '@/pages/mainPages/syarat-ketentuan/Index';
import PrivacyPolicy from '@/pages/mainPages/privacy-policy/Index';
import Faq from '@/pages/mainPages/faq/Index';
import UserProfile from '@/pages/mainPages/user-profile/Index';
import Booking from '@/pages/mainPages/form-pemesanan/Index';
import BookingPage from '@/components/partials/mainPartials/form-pemesanan/Index';

// Auth Pages
import Login from '@/pages/login/Index';
import Register from '@/pages/register/Index';
import ForgotPassword from '@/pages/forgotPassword/Index';
import VerifyOtp from '@/pages/verify-otp/Index';


function MainRoutes() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/article" element={<Article />} />
        <Route path="/tour-package" element={<TourPackage />} />
        <Route path="/tour-packages/:id" element={<TourPackageDetails />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-condition" element={<TermsConditionsPage />} />
        <Route path="/faq" element={<Faq />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <BookingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default MainRoutes;