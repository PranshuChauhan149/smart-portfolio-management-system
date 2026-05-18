import { motion } from 'framer-motion';
import { Shield, Cpu, Target, Award, Zap, TrendingUp } from 'lucide-react';
import { GlassCard } from '../components/UI';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardFeatures = [
    {
      icon: Cpu,
      title: 'AI-Powered Insights',
      description: 'Leverage machine learning algorithms to scan market parameters and deliver actionable portfolio health optimization advice.',
      color: '#6366F1',
    },
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'Your wealth and transactional history are protected with state-of-the-art encryption standards and robust authentication protocols.',
      color: '#10B981',
    },
    {
      icon: Target,
      title: 'Tailored Asset Allocation',
      description: 'Receive highly individualized allocation maps based strictly on your conservative, balanced, or aggressive risk preferences.',
      color: '#F59E0B',
    },
    {
      icon: Zap,
      title: 'Real-time High-velocity Sync',
      description: 'Observe assets update instantaneously as markets shift, giving you up-to-the-millisecond precision on ROI calculations.',
      color: '#8B5CF6',
    },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '120px 20px', background: 'var(--bg-primary)' }}>
      {/* Decorative Radial Gradients */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '5%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366F1', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>
            <Award size={14} /> Empowering Global Investors
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 56px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            Unlocking Futuristic Wealth Analytics <br />
            <span style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              For Everyone, Everywhere
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 850, margin: '24px auto 0' }}>
            Smart Portfolio is a next-generation SaaS fintech system engineered to give individual investors elite-level, institutional analytical capabilities. By integrating smart automated rules, portfolio rebalancing scripts, and customizable dashboards, we assist you in making risk-calibrated decisions with complete confidence.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 24, 
            marginBottom: 100 
          }}
        >
          <GlassCard hover={false} style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 900, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>10k+</div>
            <div style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>Active Wealth Builders</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Consistently managing portfolios and refining allocation structures daily.</div>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 900, background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>₹500M+</div>
            <div style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>Assets Under Analysis</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Successfully tracked across Stocks, Crypto, Mutual Funds, Gold, and Bonds.</div>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 900, background: 'linear-gradient(135deg, #F59E0B, #D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>99.9%</div>
            <div style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>Uptime & Live Markets Sync</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>High-availability SQLite database keeping systems operational with zero delay.</div>
          </GlassCard>
        </motion.div>

        {/* Core Capabilities */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{ marginBottom: 100 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>Our Elite Core Foundations</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>Discover the fundamental core services built directly inside your investor console.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {cardFeatures.map((feat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <GlassCard style={{ padding: 32, height: '100%' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(${feat.color === '#6366F1' ? '99,102,241' : feat.color === '#10B981' ? '16,185,129' : feat.color === '#F59E0B' ? '245,158,11' : '139,92,246'}, 0.15)`, color: feat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <feat.icon size={24} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{feat.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Futuristic Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <GlassCard style={{ padding: '60px 40px', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', mdDirection: 'row', gap: 40, alignItems: 'center' }}>
              <div style={{ flex: 1.5 }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
                  Why We Stand Out
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                  Traditional bank interfaces are rigid and offer zero risk-hedging suggestions. At Smart Portfolio, we provide advanced, beautiful data structures. Our real-time Recharts modules generate instant visuals. High-capacity risk evaluation frameworks scan your stock vs bond percentages instantly.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1' }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Advanced analytics powered by Recharts engine</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Fast backend API pipelines powered by Laravel 12</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Seamless Redux state-management for optimal SPA speed</span>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <motion.div 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  style={{ width: 140, height: 140, borderRadius: 32, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(99,102,241,0.35)' }}
                >
                  <TrendingUp size={64} color="white" />
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
