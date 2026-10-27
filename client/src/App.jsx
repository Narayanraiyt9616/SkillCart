import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultPage } from './pages/ResultPage';
import { MyCertificatesPage } from './pages/MyCertificatesPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { PaymentPage } from './pages/PaymentPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCertificatesPage } from './pages/admin/AdminCertificatesPage';
import { AdminMailPage } from './pages/admin/AdminMailPage';

// AI Assistant
import { SkillCertAIAssistant } from './components/ai/SkillCertAIAssistant';

// Learner Route Guard (Learners only - Admins are redirected to /admin)
const LearnerRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
};

// Admin Route Guard (Admins only - Learners are redirected to /dashboard)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Admin Suite...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />
              <Route path="/verify" element={<VerifyCertificatePage />} />
              <Route path="/verify/:certificateId" element={<VerifyCertificatePage />} />
              <Route path="/profile/:username" element={<PublicProfilePage />} />
              <Route path="/resume" element={<ResumeBuilderPage />} />
              <Route path="/resume-builder" element={<ResumeBuilderPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Learner Routes */}
              <Route path="/dashboard" element={<LearnerRoute><UserDashboardPage /></LearnerRoute>} />
              <Route path="/payment/:courseId" element={<LearnerRoute><PaymentPage /></LearnerRoute>} />
              <Route path="/assessment/:courseId" element={<LearnerRoute><AssessmentPage /></LearnerRoute>} />
              <Route path="/certification/:certificationId/test" element={<LearnerRoute><AssessmentPage /></LearnerRoute>} />
              <Route path="/courses/:id/test" element={<LearnerRoute><AssessmentPage /></LearnerRoute>} />
              <Route path="/assessment/:attemptId/result" element={<LearnerRoute><ResultPage /></LearnerRoute>} />
              <Route path="/certificates" element={<LearnerRoute><MyCertificatesPage /></LearnerRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
              <Route path="/admin/courses" element={<AdminRoute><AdminCoursesPage /></AdminRoute>} />
              <Route path="/admin/questions" element={<AdminRoute><AdminQuestionsPage /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              <Route path="/admin/certificates" element={<AdminRoute><AdminCertificatesPage /></AdminRoute>} />
              <Route path="/admin/mail" element={<AdminRoute><AdminMailPage /></AdminRoute>} />

              {/* Fallback 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global SkillCert Gemini AI Assistant */}
            <SkillCertAIAssistant />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
