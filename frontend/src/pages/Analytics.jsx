import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { portfolioService } from '../services';
import { GlassCard, StatCard } from '../components/UI';
import { formatCurrency } from '../utils/format';
import { Activity } from 'lucide-react';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await portfolioService.summary();
      setSummary(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p style={{ marginBottom: 4, color: 'var(--text-muted)' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontWeight: 600 }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const performanceData = summary?.monthly_performance || [];

  return (
    <div className="content-area">
      <h1 className="section-title">Analytics</h1>
      <p className="section-subtitle">Deep dive into your portfolio performance</p>

      {/* Main Performance Chart */}
      <GlassCard hover={false} style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Monthly Performance</h3>
        {loading ? (
          <div className="skeleton" style={{ height: 300 }} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="investment" name="Investment" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value" name="Current Value" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <StatCard
          title="Best Month"
          value="Oct 2023"
          prefix=""
          icon={Activity}
          color="#22C55E"
          trend="up"
          trendValue="+12.4%"
        />
        <StatCard
          title="Worst Month"
          value="Feb 2024"
          prefix=""
          icon={Activity}
          color="#EF4444"
          trend="down"
          trendValue="-4.2%"
        />
      </div>
    </div>
  );
}
