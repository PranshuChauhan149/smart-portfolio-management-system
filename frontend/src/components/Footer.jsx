import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '60px 20px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between', marginBottom: 40 }}>
          
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>S</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Smart Portfolio</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              {t('footer.description')}
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} className="hover:text-primary"><Globe size={20} /></a>
              <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} className="hover:text-primary"><Mail size={20} /></a>
              <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} className="hover:text-primary"><Phone size={20} /></a>
            </div>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 16 }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><Link to="/features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }} className="hover:text-primary">Features</Link></li>
              <li><Link to="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }} className="hover:text-primary">Pricing</Link></li>
              <li><Link to="/security" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }} className="hover:text-primary">Security</Link></li>
            </ul>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 16 }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li><a href="#about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }} className="hover:text-primary">{t('landing.about')}</a></li>
              <li><a href="#contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }} className="hover:text-primary">{t('landing.contact')}</a></li>
              <li><Link to="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }} className="hover:text-primary">Blog</Link></li>
            </ul>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            &copy; {new Date().getFullYear()} Smart Portfolio. {t('footer.rights')}
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13 }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13 }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
