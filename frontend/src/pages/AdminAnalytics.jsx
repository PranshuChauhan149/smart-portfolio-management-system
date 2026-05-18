import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { adminService } from '../services';
import { GlassCard } from '../components/UI';
import { formatCurrency } from '../utils/format';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await adminService.analytics();
      setData(res.data.data);
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
              {p.name}: {p.name.includes('Users') ? p.value : formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="content-area">
      <h1 className="section-title">Platform Analytics</h1>
      <p className="section-subtitle">Deep insights into platform usage and growth</p>

      <div style={{ display: 'grid', gap: 24, marginTop: 32 }}>
        
        {/* User Growth */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>User Growth</h3>
          {loading ? (
            <div className="skeleton" style={{ height: 300 }} />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.user_growth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="users" name="Total Users" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          {/* Asset Performance */}
          <GlassCard hover={false} style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Asset Class Performance</h3>
            {loading ? (
              <div className="skeleton" style={{ height: 300 }} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.portfolios_by_type || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="asset_type" tick={{ fill: '#64748B', fontSize: 11, textTransform: 'capitalize' }} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="total_investment" name="Investment" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total_value" name="Current Value" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* Top Investors */}
          <GlassCard hover={false} style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Top Investors</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Portfolios</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td><div className="skeleton" style={{ width: 100, height: 20 }} /></td>
                        <td><div className="skeleton" style={{ width: 40, height: 20 }} /></td>
                        <td><div className="skeleton" style={{ width: 80, height: 20 }} /></td>
                      </tr>
                    ))
                  ) : data?.top_investors?.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>No data</td></tr>
                  ) : (
                    data?.top_investors?.map(user => (
                      <tr key={user.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</td>
                        <td>{user.portfolios_count}</td>
                        <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{formatCurrency(user.total_value)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
