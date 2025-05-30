import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "./ProtectedRoutes";

// Main Pages
import Homepage from "../pages/mainPages/homepage/Index";
import Profile from "../pages/mainPages/profile/Index";
import Article from "@/pages/mainPages/article/Index";
import TourPackage from "@/pages/mainPages/tourPackage/Index";
import Destination from "@/pages/mainPages/destination/Index";
import TourPackageDetails from "@/pages/mainPages/tourPackage/DetailPackage";
import TermsConditionsPage from "@/pages/mainPages/syarat-ketentuan/Index";
import PrivacyPolicy from "@/pages/mainPages/privacy-policy/Index";
import Faq from "@/pages/mainPages/faq/Index";
import UserProfile from "@/pages/mainPages/user-profile/Index";
import BookingForm from "@/components/partials/mainPartials/booking/booking-form";
import BookingSuccess from "@/components/partials/mainPartials/booking/booking-success";
import BookingDetail from "@/components/partials/mainPartials/booking/booking-detail";
import BookingPending from "@/components/partials/mainPartials/booking/booking-pending";
import BookingError from "@/components/partials/mainPartials/booking/booking-error";
import EVoucherPage from "@/components/partials/mainPartials/booking/e-voucher";

// Auth Pages
import Login from "@/pages/login/Index";
import Register from "@/pages/register/Index";
import ForgotPassword from "@/pages/forgotPassword/Index";
import VerifyOtp from "@/pages/verify-otp/Index";

// Detail Pages
import DestinationDetail from "@/components/partials/mainPartials/destination/detailDestination";
import ArticleDetail from "@/components/partials/mainPartials/article/detailArticle";

function MainRoutes() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/article" element={<Article />} />
        <Route path="/article/:slug" element={<ArticleDetail />} />
        <Route path="/article/id/:id" element={<ArticleDetail />} />
        <Route path="/tour-package" element={<TourPackage />} />
        <Route path="/paket-wisata/:id" element={<TourPackageDetails />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
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
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:id/:scheduleId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-success/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-detail/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-pending/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingPending />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-error/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingError />
            </ProtectedRoute>
          }
        />
        <Route
          path="/e-voucher/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <EVoucherPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default MainRoutes;
