import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNavbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const navLinks = [
    { name: t('landing.home'), path: '/' },
    { name: t('landing.about'), path: '/about' },
    { name: t('landing.contact'), path: '/contact' },
  ];

  if (isAuthenticated) {
    navLinks.push({ 
      name: 'Dashboard', 
      path: user?.role === 'admin' ? '/admin' : '/dashboard' 
    });
  }

  return (
    <nav className="public-navbar" style={{ position: 'sticky', top: 0, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>S</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }} className="logo-text">Smart Portfolio</span>
        </Link>
      </div>
      
      {/* Center: Navigation Links (Desktop) */}
      <div style={{ display: 'flex', gap: 32 }} className="desktop-nav">
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            style={{ 
              color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--text-muted)', 
              textDecoration: 'none', 
              fontWeight: location.pathname === link.path ? 600 : 500,
              transition: 'color 0.2s',
              fontSize: 14
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setLangOpen(!langOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Globe size={18} /> <span style={{ fontSize: 13, textTransform: 'uppercase' }} className="lang-text">{i18n.language.substring(0, 2)}</span>
          </button>
          {langOpen && (
            <div style={{ position: 'absolute', top: 30, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
              <button onClick={() => changeLanguage('en')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer', textAlign: 'left', borderRadius: 4, fontSize: 13 }}>English</button>
              <button onClick={() => changeLanguage('hi')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer', textAlign: 'left', borderRadius: 4, fontSize: 13 }}>हिंदी (Hindi)</button>
              <button onClick={() => changeLanguage('es')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer', textAlign: 'left', borderRadius: 4, fontSize: 13 }}>Español</button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: 4 }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="desktop-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: 13 }}>Log In</Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: 13 }}>Get Started</Link>
            </>
          ) : (
            <Link to={user?.role === 'admin' ? '/admin' : '/profile'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: 'white',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
                cursor: 'pointer',
                border: '2px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.2s'
              }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: 4 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ 
                    color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--text-primary)', 
                    textDecoration: 'none', 
                    fontWeight: 600,
                    fontSize: 15
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="divider" style={{ margin: '8px 0' }} />

            <div style={{ display: 'flex', gap: 12 }}>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="btn-secondary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Log In</Link>
                  <Link to="/register" className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Get Started</Link>
                </>
              ) : (
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}>
                  Go to Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
