import {useEffect} from "react"
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/main/LoadingSpinner"

//  user pages components
import Signin from "../pages/authPages/Signin";
import Signup from "../pages/authPages/Signup";
import VerifyOtp from "../pages/authPages/VerifyOtp";
import ForgotPassword from "../pages/authPages/ForgotPassword"
import ResetPassword from "../pages/authPages/ResetPassword"

// files pages
import Dashboard from "../pages/Dashboard";
import MyFiles from "../pages/MyFiles";
import Settings from "../pages/Settings";
import Setup from "../pages/Setup"
import NotFound from "../pages/NotFound";
import FileCategoryPage from "../pages/FileCategoryPage";
import FileTypePage from "../pages/FileTypePage";
import FilePreview from "../components/files/FilePreview";

import { useAuthStore } from "../store/useAuthStore";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' replace />;
  }

  if (!user.isVerified) {
    return <Navigate to='/Verify' replace />;
  }

  return children;
};


const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }

  return children;
}

export default function AppRoutes() {

   const {isCheckingAuth, checkAuth} = useAuthStore();

   useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <LoadingSpinner />
  return (
    <Routes>
      <Route path="/sign-in" element={<RedirectAuthenticatedUser><Signin /></RedirectAuthenticatedUser>} />
      <Route path="/sign-up" element={<RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser>} />
      <Route path="/Verify" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPassword /></RedirectAuthenticatedUser>} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/MyFiles" element={<ProtectedRoute><MyFiles /></ProtectedRoute>} />
        <Route path="/MyFiles/:folderId" element={<ProtectedRoute><MyFiles /></ProtectedRoute>} />
        <Route path="/starred" element={<ProtectedRoute><FileTypePage category="starred" title="Starred Files" /></ProtectedRoute>}/>
        <Route path="/recent" element={<ProtectedRoute><FileTypePage category="recent" title="Recent Files" /></ProtectedRoute>} />
        <Route path="/trash" element={<ProtectedRoute><FileTypePage category="trash" title="Trash Files" /></ProtectedRoute>} />
        <Route path="/shared" element={<ProtectedRoute><FileTypePage category="shared" title="Shared Files" /></ProtectedRoute>}/>
        <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="/images" element={<ProtectedRoute><FileCategoryPage category="images" title="Images" /></ProtectedRoute>} />
        <Route path="/videos" element={<ProtectedRoute><FileCategoryPage category="videos" title="Videos" /></ProtectedRoute>} />
        <Route path="/audios" element={<ProtectedRoute><FileCategoryPage category="audios" title="Audios" /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><FileCategoryPage category="documents" title="Documents" /></ProtectedRoute>} />
        <Route path="/others" element={<ProtectedRoute><FileCategoryPage category="others" title="Others" /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/preview/:id" element={<ProtectedRoute><FilePreview /></ProtectedRoute>} />
      <Route path="/Setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
    </Routes>
  );
}
