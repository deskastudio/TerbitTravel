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
import CrudExample from '@/components/CrudExample';
import TermsConditionsPage from '@/components/partials/mainPartials/syarat-ketentuan/Index';
import PrivacyPolicy from '@/components/partials/mainPartials/privacy-policy/Index';
import Faq from '@/components/partials/mainPartials/faq/Index';
import UserProfile from '@/pages/mainPages/user-profile/Index';

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
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-condition" element={<TermsConditionsPage />} />
      <Route path="/faq" element={<Faq/>} />
      <Route path="/user-profile" element={<UserProfile/>} />

      {/* crud ecample */}
      <Route path="/crud-example" element={<CrudExample />} />
      {/* crud ecample */}
    </Routes>
  );
}

export default MainRoutes;
