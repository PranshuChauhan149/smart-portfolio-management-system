import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BarChart3, Shield, PieChart, TrendingUp, Zap } from 'lucide-react';
import { AuroraBackground } from '../components/UI';

export default function Landing() {
  const { t } = useTranslation();

  const features = [
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Track your portfolio performance with beautiful, interactive charts and real-time data.' },
    { icon: Shield, title: 'Smart Risk Analysis', desc: 'AI-driven insights to help you balance your portfolio and minimize exposure.' },
    { icon: PieChart, title: 'Asset Allocation', desc: 'Visualize your investments across stocks, crypto, gold, and bonds effortlessly.' },
    { icon: TrendingUp, title: 'Market Trends', desc: 'Stay ahead with live market data for top cryptocurrencies and assets.' },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <AuroraBackground />

      {/* Hero Section */}
      <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 800 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 40, marginBottom: 32 }}>
            <Zap size={14} color="#6366F1" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6366F1' }}>The Future of Investment Tracking</span>
          </div>
          
          <h1 className="hero-title" style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {t('landing.title').split(' ').map((word, i, arr) => 
              i > arr.length - 3 ? <span key={i} className="gradient-text">{word} </span> : word + ' '
            )}
          </h1>
          
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-muted)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
            {t('landing.subtitle')}
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 32px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              {t('landing.startFree')} <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '16px 32px', fontSize: 16 }}>
              {t('landing.viewDemo')}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ padding: '80px 20px', background: 'var(--bg-secondary)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{t('landing.featuresTitle')}</h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>{t('landing.featuresSubtitle')}</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
                style={{ padding: 32 }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={24} color="#6366F1" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
