import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Layout } from "./components/layout";
import { ScrollToTopOnRouteChange, ProtectedRoute } from "./components/common";
import ExternalAuthRedirect from "./components/common/ExternalAuthRedirect";
import ExternalAuthReturn from "./components/common/ExternalAuthReturn";
import { AuthProvider } from "./contexts/AuthContext";
import { ROUTES } from "./constants/routes";
import {
  Home,
  About,
  Contact,
  Courses,
  CourseDetail,
  Portfolio,
  Blog,
  NotFound,
  PrivacyPolicy,
  TermsOfService,
  Refunds,
  Legal,
  FAQ,
  JinnarCourses,
  // Profile Pages
  EditProfile,
  MyCourses,
  Notification,
  Settings,
  AdminDashboard,
} from "./pages";
import AdminLogin from "./pages/AdminLogin";
import Watch from "./pages/Watch";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        {/* Scroll to top on route change */}
        <ScrollToTopOnRouteChange />

        <Routes>
          {/* Auth routes without layout */}
          <Route path={ROUTES.LOGIN} element={<ExternalAuthRedirect />} />
          <Route path={ROUTES.SIGNUP} element={<ExternalAuthRedirect />} />
          <Route path={ROUTES.AUTH_RETURN} element={<ExternalAuthReturn />} />

          {/* Admin Login - separate from user auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Privacy Policy with custom layout (floating header) */}
          <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />

          {/* Terms of Service with custom layout (floating header) */}
          <Route path={ROUTES.TERMS_OF_SERVICE} element={<TermsOfService />} />

          {/* Refunds with custom layout (floating header) */}
          <Route path={ROUTES.REFUNDS} element={<Refunds />} />

          {/* Legal with custom layout (floating header) */}
          <Route path={ROUTES.LEGAL} element={<Legal />} />

          {/* FAQ with custom layout (floating header) */}
          <Route path={ROUTES.FAQ} element={<FAQ />} />

          {/* JinnarCourses Page */}
          <Route path={ROUTES.JINNAR_COURSES} element={<JinnarCourses />} />

          <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetail />} />
          <Route
            path={ROUTES.WATCH}
            element={
              <ProtectedRoute>
                <Watch />
              </ProtectedRoute>
            }
          />

          {/* Main routes with layout */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.ABOUT} element={<About />} />
                  <Route path={ROUTES.CONTACT} element={<Contact />} />
                  <Route path={ROUTES.COURSES} element={<Courses />} />

                  <Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
                  <Route path={ROUTES.BLOG} element={<Blog />} />

                  {/* Profile Routes */}
                  <Route
                    path={ROUTES.EDIT_PROFILE}
                    element={
                      <ProtectedRoute>
                        <EditProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Dashboard - uses JWT auth, not Firebase */}
                  <Route
                    path={ROUTES.ADMIN_DASHBOARD}
                    element={<AdminDashboard />}
                  />
                  <Route
                    path={ROUTES.MY_COURSES}
                    element={
                      <ProtectedRoute>
                        <MyCourses />
                      </ProtectedRoute>
                    }
                  />
                  {/* <Route path={ROUTES.TEAM} element={<Team />} /> */}
                  <Route
                    path={ROUTES.NOTIFICATION}
                    element={<Notification />}
                  />
                  <Route
                    path={ROUTES.SETTINGS}
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>

        {/* Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthProvider>
  );
}

export default App;
