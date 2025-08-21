import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { ROUTES } from './constants/routes';
import {
  Home,
  About,
  Contact,
  Services,
  Portfolio,
  Blog,
  Login,
  Signup,
  NotFound,
} from './pages';

function App() {
  return (
    <div className='App'>
      <Routes>
        {/* Auth routes without layout */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />

        {/* Main routes with layout */}
        <Route
          path='*'
          element={
            <Layout>
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path={ROUTES.CONTACT} element={<Contact />} />
                <Route path={ROUTES.SERVICES} element={<Services />} />
                <Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
                <Route path={ROUTES.BLOG} element={<Blog />} />

                {/* 404 Route */}
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
