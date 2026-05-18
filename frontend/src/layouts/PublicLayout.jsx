import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <div style={{ flex: 1, position: 'relative' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
