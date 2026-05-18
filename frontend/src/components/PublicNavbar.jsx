import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function PublicNavbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);

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
    <nav style={{ position: 'sticky', top: 0, padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>S</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Smart Portfolio</span>
        </Link>
      </div>
      
      {/* Center: Navigation Links */}
      <div style={{ display: 'flex', gap: 32, flex: 1, justifyContent: 'center' }} className="hidden md:flex">
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            style={{ 
              color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--text-muted)', 
              textDecoration: 'none', 
              fontWeight: location.pathname === link.path ? 600 : 500,
              transition: 'color 0.2s'
            }}
            className="hover:text-primary"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setLangOpen(!langOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Globe size={18} /> <span style={{ fontSize: 14, textTransform: 'uppercase' }}>{i18n.language.substring(0, 2)}</span>
          </button>
          {langOpen && (
            <div style={{ position: 'absolute', top: 30, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button onClick={() => changeLanguage('en')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer', textAlign: 'left', borderRadius: 4 }} className="hover:bg-primary/10">English</button>
              <button onClick={() => changeLanguage('hi')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer', textAlign: 'left', borderRadius: 4 }} className="hover:bg-primary/10">हिंदी (Hindi)</button>
              <button onClick={() => changeLanguage('es')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer', textAlign: 'left', borderRadius: 4 }} className="hover:bg-primary/10">Español</button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn-secondary hidden sm:block" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 14 }}>Log In</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 14 }}>Get Started</Link>
          </>
        ) : (
          <Link to={user?.role === 'admin' ? '/admin' : '/profile'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
              cursor: 'pointer',
              border: '2px solid rgba(255,255,255,0.1)',
              transition: 'transform 0.2s'
            }}
            className="hover:scale-105"
            title={user?.name || 'Profile'}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
