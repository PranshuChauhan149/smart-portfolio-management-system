import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lightbulb, AlertTriangle } from 'lucide-react';
import { adviceService, portfolioService } from '../services';
import { GlassCard, StatCard, EmptyState, RiskBadge } from '../components/UI';

export default function RiskAnalysis() {
  const [advices, setAdvices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adviceRes, summaryRes] = await Promise.all([
        adviceService.list(),
        portfolioService.summary(),
      ]);
      setAdvices(adviceRes.data.data?.data || []);
      setSummary(summaryRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await adviceService.generate();
      await fetchData();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="section-title">Risk Analysis</h1>
          <p className="section-subtitle">AI-driven insights for your portfolio</p>
        </div>
        <button onClick={handleGenerate} className="btn-primary" style={{ padding: '8px 16px' }}>
          Generate New Advice
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 24 }}>
        <StatCard
          title="Overall Risk Score"
          value={summary?.risk_score || 0}
          suffix="/100"
          icon={Shield}
          color="#F59E0B"
          trend="neutral"
          trendValue={summary?.risk_score < 40 ? 'Conservative' : summary?.risk_score < 70 ? 'Balanced' : 'Aggressive'}
          loading={loading}
        />
        
        <GlassCard hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>Risk Distribution</h3>
          {loading ? (
            <div className="skeleton" style={{ height: 40 }} />
          ) : (
            <div style={{ display: 'flex', height: 24, borderRadius: 12, overflow: 'hidden' }}>
              {summary?.risk_distribution && Object.entries(summary.risk_distribution).map(([level, data]) => {
                const total = summary.total_current_value || 1;
                const width = `${(data.value / total) * 100}%`;
                const bg = level === 'high' ? '#EF4444' : level === 'medium' ? '#F59E0B' : '#22C55E';
                return <div key={level} style={{ width, background: bg, transition: 'width 0.5s ease' }} title={`${level}: ${width}`} />;
              })}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard hover={false} style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Smart Recommendations</h3>
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12, borderRadius: 12 }} />)
        ) : advices.length === 0 ? (
          <EmptyState icon={Lightbulb} title="No insights yet" description="Generate advice to get personalized recommendations." action={<button onClick={handleGenerate} className="btn-primary">Generate Advice</button>} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {advices.map((advice, i) => (
              <motion.div
                key={advice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: advice.risk_level === 'high' ? 'rgba(239,68,68,0.08)' : advice.risk_level === 'low' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${advice.risk_level === 'high' ? 'rgba(239,68,68,0.2)' : advice.risk_level === 'low' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ marginTop: 2 }}>
                  {advice.category === 'alert' ? <AlertTriangle size={20} color="#EF4444" /> : <Lightbulb size={20} color={advice.risk_level === 'high' ? '#EF4444' : '#F59E0B'} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <RiskBadge level={advice.risk_level} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{advice.category}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{advice.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
