import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import Landing from "./pages/Landing";
import Culture from "./pages/Culture";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerify from "./pages/OtpVerify";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Places from "./pages/Places";
import CultureDetail from "./pages/CultureDetail";
import Loader from "./components/Loader";
import AIChatbot from "./pages/AIChatbot";
import DiseaseDetector from "./pages/DiseaseDetector";
import Recommendation from "./pages/Recommendation";
import BookNow from "./pages/BookNow";
import Blogs from "./pages/Blogs";
import Birds from "./pages/Birds";
import Activities from "./pages/Activities";
import UserDashboard from "./pages/UserDashboard";
import PlaceDetails from "./pages/PlaceDetails";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";




function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/places" element={<Places />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/culture/:id" element={<CultureDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chatbot" element={<AIChatbot />} />
        <Route path="/disease-detector" element={<DiseaseDetector />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/book-now/:id" element={<BookNow />} />
        <Route path="/book-now" element={<BookNow />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/birds" element={<Birds />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/places/:id" element={<PlaceDetails />} />
        <Route path="/admin-dashboard" element={ <PrivateRoute> <AdminDashboard /> </PrivateRoute> } />
        <Route path="/dashboard" element={ <PrivateRoute> <UserDashboard /> </PrivateRoute> } />  
       <Route path="/admin-dashboard" element={ <AdminRoute> <AdminDashboard /> </AdminRoute> } /> 
       <Route path="/user-dashboard" element={<UserDashboard />} />


         
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) return <Loader />;

  return <AnimatedRoutes />;
}

export default App;
