import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Briefcase, BarChart3, Shield, TrendingUp,
  Bell, FileText, User, Settings, LogOut, ChevronLeft,
  ChevronRight, Users, Activity, X, MessageSquare, Home
} from 'lucide-react';
import { logout } from '../store/authSlice';
import { resetPortfolio } from '../store/portfolioSlice';
import { authService } from '../services';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

const userNavItems = [
  { path: '/', label: 'Home Page', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/risk', label: 'Risk Analysis', icon: Shield },
  { path: '/market', label: 'Market Trends', icon: TrendingUp },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/profile', label: 'Profile', icon: User },
];

const adminNavItems = [
  { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Manage Users', icon: Users },
  { path: '/admin/analytics', label: 'Analytics', icon: Activity },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLightMode = theme === 'light';

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;
  const sidebarSurface = isLightMode ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.95)';
  const sidebarBorder = isLightMode ? 'rgba(148, 163, 184, 0.22)' : 'var(--border)';
  const sidebarShadow = isLightMode ? '0 18px 50px rgba(15, 23, 42, 0.08)' : 'none';

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch { /* ignore */ }
    dispatch(logout());
    dispatch(resetPortfolio());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const SidebarContent = () => (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        marginBottom: 24,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
        }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>S</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Smart Portfolio
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {user?.role === 'admin' ? 'Admin Panel' : 'Investor Hub'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, overflow: 'hidden auto' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin' || item.path === '/'}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            onClick={onMobileClose}
            title={collapsed ? item.label : ''}
          >
            <item.icon size={18} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="divider" />

      {/* User Section */}
      <div style={{ padding: '8px 12px', marginBottom: 8 }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {user?.role === 'admin' ? '👑 Admin' : '📈 Investor'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="sidebar-item"
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: 'var(--color-danger)',
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse button (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          borderRadius: 8,
          background: isLightMode ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          margin: '0 12px',
        }}
        className="hidden md:flex"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="sidebar hidden md:block"
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          overflow: 'hidden',
          background: sidebarSurface,
          borderRight: `1px solid ${sidebarBorder}`,
          backdropFilter: 'blur(20px)',
          boxShadow: sidebarShadow,
        }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 200,
              }}
              onClick={onMobileClose}
            />
            <motion.aside
              className="sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                width: 260,
                zIndex: 201,
                background: sidebarSurface,
                borderRight: `1px solid ${sidebarBorder}`,
                backdropFilter: 'blur(20px)',
                boxShadow: sidebarShadow,
              }}
            >
              <button
                onClick={onMobileClose}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: isLightMode ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${sidebarBorder}`,
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  zIndex: 1,
                }}
              >
                <X size={16} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
