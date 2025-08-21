import Header from './Header';
import Footer from './Footer';
import { ScrollToTop } from '../ui';

const Layout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      {showHeader && <Header />}

      <main className='flex-grow'>{children}</main>

      {showFooter && <Footer />}

      <ScrollToTop />
    </div>
  );
};

export default Layout;
