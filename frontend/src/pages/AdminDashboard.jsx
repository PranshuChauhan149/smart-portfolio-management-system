import { useState, useEffect } from 'react';
import { Users, Briefcase, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { adminService } from '../services';
import { StatCard, GlassCard } from '../components/UI';
import { formatCurrency } from '../utils/format';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminService.dashboard();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <h1 className="section-title">Admin Dashboard</h1>
      <p className="section-subtitle">Platform overview and statistics</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard
          title="Total Users"
          value={data?.total_users || 0}
          icon={Users}
          color="#6366F1"
          loading={loading}
          trend="neutral"
          trendValue={`${data?.active_users || 0} active`}
        />
        <StatCard
          title="Total Portfolios"
          value={data?.total_portfolios || 0}
          icon={Briefcase}
          color="#8B5CF6"
          loading={loading}
        />
        <StatCard
          title="Total Platform Value"
          value={data?.total_value || 0}
          prefix="₹"
          icon={DollarSign}
          color="#22C55E"
          loading={loading}
        />
        <StatCard
          title="Pending Approvals"
          value={data?.pending_users || 0}
          icon={Activity}
          color="#F59E0B"
          loading={loading}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <GlassCard hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Global Asset Distribution</h3>
          {loading ? (
            <div className="skeleton" style={{ height: 250 }} />
          ) : data?.asset_distribution?.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No data available</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={data?.asset_distribution}
                    dataKey="total_value"
                    nameKey="asset_type"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    strokeWidth={0}
                  >
                    {data?.asset_distribution.map((entry, index) => (
                      <Cell key={entry.asset_type} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => formatCurrency(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {data?.asset_distribution.map((entry, i) => (
                  <div key={entry.asset_type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      <span style={{ fontSize: 13, textTransform: 'capitalize' }}>{entry.asset_type.replace('_', ' ')}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{formatCurrency(entry.total_value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Recent Platform Activity</h3>
          {loading ? (
            Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 12 }} />)
          ) : data?.recent_transactions?.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No recent activity</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data?.recent_transactions.map((tx) => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.user?.name || 'Unknown User'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{tx.action} {tx.asset_name}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tx.action === 'buy' ? 'var(--color-success)' : tx.action === 'sell' ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
