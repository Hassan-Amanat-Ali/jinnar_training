import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Layout } from './components/layout';
import { ScrollToTopOnRouteChange } from './components/common';
import { ROUTES } from './constants/routes';
import {
  Home,
  About,
  Contact,
  Courses,
  Portfolio,
  Blog,
  Login,
  Signup,
  NotFound,
  PrivacyPolicy,
  TermsOfService,
  Refunds,
  Legal,
} from './pages';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='App'>
      {/* Scroll to top on route change */}
      <ScrollToTopOnRouteChange />

      <Routes>
        {/* Auth routes without layout */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />

        {/* Privacy Policy with custom layout (floating header) */}
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />

        {/* Terms of Service with custom layout (floating header) */}
        <Route path={ROUTES.TERMS_OF_SERVICE} element={<TermsOfService />} />

        {/* Refunds with custom layout (floating header) */}
        <Route path={ROUTES.REFUNDS} element={<Refunds />} />

        {/* Legal with custom layout (floating header) */}
        <Route path={ROUTES.LEGAL} element={<Legal />} />

        {/* Main routes with layout */}
        <Route
          path='*'
          element={
            <Layout>
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path={ROUTES.CONTACT} element={<Contact />} />
                <Route path={ROUTES.COURSES} element={<Courses />} />
                <Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
                <Route path={ROUTES.BLOG} element={<Blog />} />

                {/* 404 Route */}
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>

      {/* Toast Container */}
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
}

export default App;
