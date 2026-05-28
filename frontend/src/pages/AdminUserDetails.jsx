import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeInfo, Bell, CalendarDays, Mail, Shield, Wallet, TrendingUp, Activity, AlertTriangle, RefreshCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { adminService } from '../services';
import { GlassCard, Button, Badge, RiskBadge, AssetTypeBadge, ProfitLoss } from '../components/UI';
import { formatCurrency, formatDate, formatPercent } from '../utils/format';
import toast from 'react-hot-toast';

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B'];

function StatTile({ label, value, icon: Icon, tone = 'default' }) {
  const backgrounds = {
    default: 'rgba(255,255,255,0.03)',
    success: 'rgba(34,197,94,0.08)',
    warning: 'rgba(245,158,11,0.08)',
    danger: 'rgba(239,68,68,0.08)',
    primary: 'rgba(99,102,241,0.08)',
  };

  return (
    <GlassCard hover={false} style={{ padding: 18, background: backgrounds[tone] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{value}</div>
        </div>
        {Icon && (
          <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center' }}>
            <Icon size={18} color="currentColor" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
        {Icon && <Icon size={14} />}
        <span>{label}</span>
      </div>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{value || '—'}</div>
    </div>
  );
}

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const loadUser = useCallback(async () => {
    try {
      const res = await adminService.userDetails(id);
      setUserData(res.data.data);
    } catch {
      toast.error('Failed to load user details');
      navigate('/admin/users');
    }
  }, [id, navigate]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await loadUser();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loadUser]);

  const portfolios = useMemo(() => userData?.user?.portfolios || [], [userData]);
  const transactions = useMemo(() => userData?.user?.transactions || [], [userData]);
  const notifications = useMemo(() => userData?.user?.notifications || [], [userData]);

  const allocationData = useMemo(() => {
    const summary = portfolios.reduce((accumulator, portfolio) => {
      const key = portfolio.asset_type || 'other';
      if (!accumulator[key]) accumulator[key] = 0;
      accumulator[key] += Number(portfolio.current_value || 0);
      return accumulator;
    }, {});

    return Object.entries(summary).map(([name, value]) => ({ name, value }));
  }, [portfolios]);

  const activityData = useMemo(() => {
    return portfolios.slice(0, 6).map((portfolio) => ({
      name: portfolio.asset_name,
      value: Number(portfolio.current_value || 0),
    }));
  }, [portfolios]);

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/users')} style={{ marginBottom: 14 }}>
            <ArrowLeft size={14} /> Back to users
          </Button>
          <h1 className="section-title">User Full Details</h1>
          <p className="section-subtitle">Open the complete profile, portfolio holdings, transactions, and notifications for this investor.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={async () => { setLoading(true); await loadUser(); setLoading(false); }} loading={loading}>
            <RefreshCcw size={14} /> Refresh
          </Button>
          <Button onClick={() => navigate('/admin/messages')}>
            <Bell size={14} /> Send Message
          </Button>
        </div>
      </div>

      {loading ? (
        <GlassCard hover={false} style={{ padding: 30 }}>
          <div className="skeleton" style={{ width: 200, height: 22, marginBottom: 14 }} />
          <div className="skeleton" style={{ width: '100%', height: 220 }} />
        </GlassCard>
      ) : (
        <>
          <GlassCard hover={false} style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg, rgba(99,102,241,0.28), rgba(168,85,247,0.22))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Shield size={28} color="#E0E7FF" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{userData.user.name}</h2>
                    <Badge type="primary">{userData.user.role?.toUpperCase()}</Badge>
                    {userData.user.status === 'active' ? <Badge type="success">Active</Badge> : <Badge type="warning">{userData.user.status}</Badge>}
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{userData.user.email}</p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: 12 }}>
                    <span>Risk preference: <strong style={{ color: 'var(--text-primary)' }}>{userData.user.risk_preference || '—'}</strong></span>
                    <span>Language: <strong style={{ color: 'var(--text-primary)' }}>{userData.user.preferred_language || 'en'}</strong></span>
                    <span>Joined: <strong style={{ color: 'var(--text-primary)' }}>{formatDate(userData.user.created_at)}</strong></span>
                    <span>Verified: <strong style={{ color: 'var(--text-primary)' }}>{userData.user.email_verified_at ? 'Yes' : 'No'}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ minWidth: 260, maxWidth: 360, flex: '1 1 280px' }}>
                <GlassCard hover={false} style={{ padding: 16 }}>
                  <InfoRow label="User ID" value={userData.user.id} icon={BadgeInfo} />
                  <InfoRow label="Email" value={userData.user.email} icon={Mail} />
                  <InfoRow label="Joined" value={formatDate(userData.user.created_at)} icon={CalendarDays} />
                  <InfoRow label="Last Updated" value={formatDate(userData.user.updated_at)} icon={CalendarDays} />
                </GlassCard>
              </div>
            </div>
          </GlassCard>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 20 }}>
            <StatTile label="Total Investment" value={formatCurrency(userData.stats.total_investment)} icon={Wallet} tone="primary" />
            <StatTile label="Current Value" value={formatCurrency(userData.stats.total_value)} icon={TrendingUp} tone="success" />
            <StatTile label="Profit / Loss" value={<ProfitLoss value={userData.stats.profit_loss} />} icon={Activity} tone={userData.stats.profit_loss >= 0 ? 'success' : 'danger'} />
            <StatTile label="Portfolio Count" value={userData.stats.portfolio_count} icon={Shield} tone="warning" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, marginBottom: 20 }}>
            <GlassCard hover={false} style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Portfolio Breakdown</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Asset composition for this investor</p>
              {allocationData.length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>No portfolio holdings available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" strokeWidth={0}>
                      {allocationData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </GlassCard>

            <GlassCard hover={false} style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Risk & Activity</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Quick signal from the portfolio history</p>
              <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
                <InfoRow label="Risk Pref" value={userData.user.risk_preference || '—'} icon={Shield} />
                <InfoRow label="Status" value={userData.user.status} icon={AlertTriangle} />
                <InfoRow label="Notifications" value={notifications.length} icon={Bell} />
                <InfoRow label="Transactions" value={transactions.length} icon={Wallet} />
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, marginBottom: 20 }}>
            <GlassCard hover={false} style={{ padding: 24, overflowX: 'auto' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Portfolio Holdings</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Full assets and performance details</p>
              <table className="data-table" style={{ minWidth: 760 }}>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Invested</th>
                    <th>Current</th>
                    <th>ROI</th>
                    <th>Risk</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map((portfolio) => (
                    <tr key={portfolio.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{portfolio.asset_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{portfolio.ticker_symbol}</div>
                      </td>
                      <td><AssetTypeBadge type={portfolio.asset_type} /></td>
                      <td>{portfolio.quantity}</td>
                      <td>{formatCurrency(portfolio.investment_amount)}</td>
                      <td>{formatCurrency(portfolio.current_value)}</td>
                      <td style={{ color: portfolio.roi >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>{formatPercent(portfolio.roi)}</td>
                      <td><RiskBadge level={portfolio.risk_level} /></td>
                      <td>{formatDate(portfolio.purchase_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>

            <GlassCard hover={false} style={{ padding: 24, overflowX: 'auto' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Recent Transactions</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Transaction history with complete records</p>
              <table className="data-table" style={{ minWidth: 680 }}>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td style={{ textTransform: 'capitalize', fontWeight: 700 }}>{transaction.action}</td>
                      <td>{transaction.asset_name}</td>
                      <td>{formatCurrency(transaction.amount)}</td>
                      <td>{formatDate(transaction.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>

          <GlassCard hover={false} style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Notifications & Notes</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>User activity and system messages related to this account</p>
            <div style={{ display: 'grid', gap: 12 }}>
              {notifications.length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>No notifications found for this user.</div>
              ) : notifications.map((notification) => (
                <div key={notification.id} style={{ padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <strong>{notification.title}</strong>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(notification.created_at || notification.createdAt)}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{notification.message}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
