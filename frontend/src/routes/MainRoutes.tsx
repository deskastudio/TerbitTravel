import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from '../pages/mainPages/homepage/Index';
import Login from '../pages/login/Index';
import Register from '../pages/register/Index';
import Profile from '../pages/mainPages/profile/Index';
import Article from '@/pages/mainPages/article/Index';
import TourPackage from '@/pages/mainPages/tourPackage/Index';
import Destination from '@/pages/mainPages/destination/Index';

function MainRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/article" element={<Article />} />
        <Route path="/tour-package" element={<TourPackage />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default MainRoutes;
