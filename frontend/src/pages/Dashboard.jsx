import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, Shield, ArrowUpRight, ArrowDownRight,
  Plus, RefreshCw, Lightbulb, Activity
} from 'lucide-react';
import { portfolioService, transactionService, adviceService } from '../services';
import { StatCard, GlassCard, SkeletonCard, RiskBadge, EmptyState, Button } from '../components/UI';
import { formatCurrency, formatPercent, formatDate, getAssetColor, getAssetLabel } from '../utils/format';
import toast from 'react-hot-toast';

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B'];

function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!target) return;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p style={{ marginBottom: 4, color: 'var(--text-muted)' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || 'var(--text-primary)', fontWeight: 600 }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [summary, setSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const totalInvestment = useCountUp(summary?.total_investment || 0);
  const totalValue = useCountUp(summary?.total_current_value || 0);
  const profitLoss = useCountUp(Math.abs(summary?.total_profit_loss || 0));
  const roi = useCountUp(Math.abs(summary?.roi || 0));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, activityRes, adviceRes] = await Promise.all([
        portfolioService.summary(),
        transactionService.recent(),
        adviceService.list(),
      ]);
      setSummary(summaryRes.data.data);
      setRecentActivity(activityRes.data.data || []);
      setAdvices(adviceRes.data.data?.data || []);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  const assetAllocationData = summary?.asset_allocation
    ? Object.entries(summary.asset_allocation).map(([type, data]) => ({
        name: getAssetLabel(type),
        value: Math.round(data.value),
        percentage: Math.round(data.percentage),
      }))
    : [];

  const profitLossValue = summary?.total_profit_loss || 0;
  const isProfit = profitLossValue >= 0;

  return (
    <div className="content-area">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋
          </motion.h1>
          <p className="section-subtitle">Here's your portfolio overview for today</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={handleRefresh} loading={refreshing} size="sm">
            <RefreshCw size={14} /> Refresh
          </Button>
          <Link to="/portfolio">
            <Button size="sm">
              <Plus size={14} /> Add Investment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Investment"
              value={totalInvestment}
              prefix="₹"
              icon={DollarSign}
              color="#6366F1"
              trendValue={`${summary?.total_assets || 0} assets`}
              trend="neutral"
            />
            <StatCard
              title="Portfolio Value"
              value={totalValue}
              prefix="₹"
              icon={TrendingUp}
              color="#8B5CF6"
              trendValue={formatPercent(summary?.roi || 0)}
              trend={isProfit ? 'up' : 'down'}
            />
            <StatCard
              title="Profit / Loss"
              value={profitLoss}
              prefix={`${isProfit ? '+' : '-'}₹`}
              icon={isProfit ? TrendingUp : TrendingDown}
              color={isProfit ? '#22C55E' : '#EF4444'}
              trendValue={`ROI: ${formatPercent(summary?.roi || 0)}`}
              trend={isProfit ? 'up' : 'down'}
            />
            <StatCard
              title="Risk Score"
              value={summary?.risk_score || 0}
              suffix="/100"
              icon={Shield}
              color="#F59E0B"
              trendValue={summary?.risk_score < 40 ? 'Low Risk' : summary?.risk_score < 70 ? 'Medium Risk' : 'High Risk'}
              trend="neutral"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Portfolio Growth Chart */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Portfolio Growth</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Investment vs Current Value</p>
          {loading ? (
            <div className="skeleton" style={{ height: 200 }} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={summary?.monthly_performance || []}>
                <defs>
                  <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="investment" name="Investment" stroke="#6366F1" strokeWidth={2} fill="url(#investGrad)" dot={false} />
                <Area type="monotone" dataKey="value" name="Value" stroke="#22C55E" strokeWidth={2} fill="url(#valueGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* Asset Allocation */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Asset Allocation</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Distribution by asset type</p>
          {loading ? (
            <div className="skeleton" style={{ height: 200 }} />
          ) : assetAllocationData.length === 0 ? (
            <EmptyState icon={Activity} title="No data" description="Add investments to see allocation" />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={assetAllocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {assetAllocationData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {assetAllocationData.map((entry, i) => (
                  <div key={entry.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{entry.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{entry.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {/* Recent Activity */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Recent Activity</h3>
            <Link to="/portfolio" style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '70%', height: 14, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: '40%', height: 12 }} />
                </div>
              </div>
            ))
          ) : recentActivity.length === 0 ? (
            <EmptyState icon={Activity} title="No activity yet" description="Your transactions will appear here" />
          ) : (
            recentActivity.slice(0, 6).map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: tx.action === 'buy' ? 'rgba(34,197,94,0.15)' : tx.action === 'sell' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {tx.action === 'buy' ? <ArrowUpRight size={16} color="#22C55E" /> : tx.action === 'sell' ? <ArrowDownRight size={16} color="#EF4444" /> : <RefreshCw size={16} color="#6366F1" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {tx.action?.toUpperCase()} {tx.asset_name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(tx.created_at)}</p>
                </div>
                <p style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: tx.action === 'buy' ? 'var(--color-success)' : 'var(--color-danger)',
                  flexShrink: 0,
                }}>
                  {tx.action === 'sell' ? '-' : '+'}{formatCurrency(tx.amount)}
                </p>
              </motion.div>
            ))
          )}
        </GlassCard>

        {/* Smart Advice */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>
              <Lightbulb size={16} style={{ display: 'inline', marginRight: 8, color: '#F59E0B' }} />
              Smart Advice
            </h3>
            <Link to="/risk" style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 72, marginBottom: 12, borderRadius: 10 }} />
            ))
          ) : advices.length === 0 ? (
            <EmptyState icon={Lightbulb} title="No advice yet" description="Add investments to get personalized advice" />
          ) : (
            advices.slice(0, 4).map((advice, i) => (
              <motion.div
                key={advice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: advice.risk_level === 'high' ? 'rgba(239,68,68,0.08)' : advice.risk_level === 'low' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${advice.risk_level === 'high' ? 'rgba(239,68,68,0.2)' : advice.risk_level === 'low' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <RiskBadge level={advice.risk_level} />
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                    {advice.message.length > 100 ? advice.message.substring(0, 100) + '...' : advice.message}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </GlassCard>
      </div>
    </div>
  );
}
