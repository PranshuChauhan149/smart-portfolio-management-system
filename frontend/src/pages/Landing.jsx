import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BarChart3, Shield, PieChart, TrendingUp, Zap, Sparkles, CheckCircle2, Clock3, Activity, Layers3, Target, Lock, Users, Globe, LineChart, ArrowUpRight } from 'lucide-react';
import { AuroraBackground } from '../components/UI';

export default function Landing() {
  const { t } = useTranslation();

  const features = [
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Track performance with clean, interactive charts, allocation snapshots, and portfolio movement over time.' },
    { icon: Shield, title: 'Smart Risk Analysis', desc: 'Understand exposure, concentration, and downside risk with clearer recommendations for better balance.' },
    { icon: PieChart, title: 'Asset Allocation', desc: 'See your wealth distribution across stocks, crypto, gold, bonds, and mutual funds at a glance.' },
    { icon: TrendingUp, title: 'Market Trends', desc: 'Follow live market momentum and compare your holdings against current trend signals.' },
    { icon: Activity, title: 'Live Portfolio Signals', desc: 'Spot activity changes early with real-time summaries, alerts, and trend movement indicators.' },
    { icon: Lock, title: 'Secure by Design', desc: 'Your account data stays protected with authenticated sessions and a privacy-first experience.' },
  ];

  const highlights = [
    'Institutional-style tracking for everyday investors',
    'Fast visual summaries with modern motion and glass surfaces',
    'Smart decisions backed by portfolio, market, and risk views',
  ];

  const steps = [
    {
      icon: Users,
      title: 'Create your profile',
      text: 'Add your portfolio in minutes and get a dashboard built around your investment style.',
    },
    {
      icon: LineChart,
      title: 'Watch the signals',
      text: 'See growth, risk, and allocation changes through smooth charts and quick summaries.',
    },
    {
      icon: Target,
      title: 'Act with clarity',
      text: 'Use insights and advice to rebalance faster and stay aligned with your goals.',
    },
  ];

  const heroStats = [
    { value: '24/7', label: 'portfolio visibility' },
    { value: '5+', label: 'asset classes supported' },
    { value: 'AI', label: 'risk-aware guidance' },
  ];

  const platformPillars = [
    { icon: Globe, title: 'Accessible anywhere', text: 'Responsive experience designed for desktop and mobile.' },
    { icon: Clock3, title: 'Fast decision flow', text: 'Shorter path from data review to action.' },
    { icon: Sparkles, title: 'Modern interface', text: 'Refined motion, layered cards, and premium visual rhythm.' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, duration: 0.6, ease: 'easeOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <AuroraBackground />

      {/* Hero Section */}
      <div className="landing-hero" style={{ minHeight: '92vh', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)', gap: 40, alignItems: 'center', padding: '88px 20px 72px', position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="landing-hero-copy"
          style={{ maxWidth: 680 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 999, marginBottom: 24, boxShadow: '0 10px 30px rgba(99,102,241,0.12)' }}>
            <Sparkles size={14} color="#6366F1" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', letterSpacing: '0.02em' }}>Modern portfolio intelligence</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(42px, 7vw, 78px)', fontWeight: 850, lineHeight: 1.02, marginBottom: 20, letterSpacing: '-0.05em', color: 'var(--text-primary)' }}>
            {t('landing.title').split(' ').map((word, i, arr) => (
              i >= arr.length - 3 ? <span key={`${word}-${i}`} className="gradient-text">{word} </span> : <span key={`${word}-${i}`}>{word} </span>
            ))}
          </h1>

          <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'var(--text-muted)', marginBottom: 28, maxWidth: 620, lineHeight: 1.7 }}>
            {t('landing.subtitle')}
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 32px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {t('landing.startFree')} <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '16px 32px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {t('landing.viewDemo')} <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="landing-hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, maxWidth: 620 }}>
            {heroStats.map((item) => (
              <div key={item.label} className="glass-card-static" style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div className="landing-hero-highlights" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
            {highlights.map((point) => (
              <div key={point} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13 }}>
                <CheckCircle2 size={14} color="#22C55E" />
                {point}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="landing-hero-visual"
          style={{ position: 'relative' }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="glass-card landing-hero-visual-card"
            style={{ padding: 24, borderRadius: 28, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Live portfolio pulse</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Today&apos;s overview</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Activity size={22} color="#6366F1" />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Portfolio growth</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>+18.4%</div>
                </div>
                <TrendingUp size={22} color="#22C55E" />
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1, padding: 16, borderRadius: 18, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Risk score</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>10/100</div>
                </div>
                <div style={{ flex: 1, padding: 16, borderRadius: 18, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Active assets</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>5</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 18, background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.18)' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Next recommendation</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>Rebalance exposure across high-volatility assets</div>
              </div>
              <ArrowUpRight size={20} color="#6366F1" />
            </div>
          </motion.div>

          
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        id="features"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        style={{ padding: '96px 20px', background: 'var(--bg-secondary)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#6366F1', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              <Layers3 size={14} /> Built for modern investors
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '-0.03em' }}>{t('landing.featuresTitle')}</h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 720, margin: '0 auto', lineHeight: 1.7 }}>{t('landing.featuresSubtitle')}</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className="glass-card"
                style={{ padding: 28, minHeight: 214 }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={24} color="#6366F1" />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.25 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 14.5 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        style={{ padding: '96px 20px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 42px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '-0.03em' }}>How the experience flows</h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>A cleaner journey from portfolio setup to better decisions, with fewer screens and more clarity.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="glass-card"
                style={{ padding: 28, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 18, right: 18, fontSize: 48, fontWeight: 900, color: 'rgba(99,102,241,0.08)' }}>{index + 1}</div>
                <div style={{ width: 54, height: 54, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.16)', marginBottom: 18 }}>
                  <step.icon size={24} color="#6366F1" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 14.5 }}>{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Platform Pillars Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        style={{ padding: '0 20px 96px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32, borderRadius: 28, background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.05))' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              {platformPillars.map((pillar) => (
                <div key={pillar.title} style={{ padding: 8 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.14)', marginBottom: 16 }}>
                    <pillar.icon size={22} color="#6366F1" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{pillar.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 14.5 }}>{pillar.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        style={{ padding: '0 20px 110px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '42px 28px', borderRadius: 28, textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14, color: '#6366F1', fontWeight: 700, fontSize: 13 }}>
              <Zap size={14} /> Ready to begin
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.03em' }}>Build a clearer view of your money today</h2>
            <p style={{ maxWidth: 700, margin: '0 auto 26px', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7 }}>
              Create your account, add your assets, and move from static numbers to a living portfolio experience with modern visuals and real insight.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 32px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                {t('landing.startFree')} <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary" style={{ textDecoration: 'none', padding: '16px 32px', fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                Learn more <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
