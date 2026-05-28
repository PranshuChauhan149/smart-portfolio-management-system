import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  DollarSign,
  Lightbulb,
  Plus,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, GlassCard, Modal, SkeletonCard, StatCard, RiskBadge } from '../components/UI';
import {
  AssetDetailModal,
  NotificationBell,
} from '../components/InvestmentWidgets';
import { portfolioService, transactionService, adviceService } from '../services';
import {
  addInvestment,
  hydratePortfolioData,
  markAllNotificationsRead,
  markNotificationRead,
  refreshInsights,
  selectPortfolioAssets,
  selectPortfolioNotifications,
  selectPortfolioTransactions,
  selectWatchlist,
  toggleWatchlist,
} from '../store/portfolioSlice';
import {
  calculatePortfolioSummary,
  generateSmartAdvice,
  getTopTrendingAssets,
} from '../data/investmentData';
import { formatCurrency, formatDate, formatPercent } from '../utils/format';

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B'];

function useAnimatedNumber(target, duration = 850) {
  const [value, setValue] = useState(0);
  const previousRef = useRef(0);

  useEffect(() => {
    const startValue = previousRef.current;
    const startTime = performance.now();
    let frameId;

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (target - startValue) * eased;
      setValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        previousRef.current = target;
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="custom-tooltip">
      <p style={{ marginBottom: 4, color: 'var(--text-muted)' }}>{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} style={{ color: item.color || 'var(--text-primary)', fontWeight: 600 }}>
          {item.name}: {formatCurrency(item.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const assets = useSelector(selectPortfolioAssets);
  const notifications = useSelector(selectPortfolioNotifications);
  const transactions = useSelector(selectPortfolioTransactions);
  const watchlist = useSelector(selectWatchlist);
  const [refreshing, setRefreshing] = useState(false);
  const [activeAsset, setActiveAsset] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionFilter, setTransactionFilter] = useState('all');

  const summary = useMemo(() => calculatePortfolioSummary(assets), [assets]);
  const trendingAssets = useMemo(() => getTopTrendingAssets(assets).slice(0, 5), [assets]);
  const smartAdvice = useMemo(() => generateSmartAdvice(assets), [assets]);

  const animatedInvestment = useAnimatedNumber(summary.totalInvestment);
  const animatedCurrentValue = useAnimatedNumber(summary.totalCurrentValue);
  const animatedProfitLoss = useAnimatedNumber(Math.abs(summary.totalProfitLoss));
  const loading = false;

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [assetsRes, transactionsRes] = await Promise.all([
          portfolioService.assets(),
          transactionService.list({ per_page: 20 }),
        ]);

        dispatch(hydratePortfolioData({
          assets: assetsRes.data.data,
          transactions: transactionsRes.data.data?.data || transactionsRes.data.data || [],
        }));
      } catch {
        // keep the local dummy data when backend is unavailable
      }
    };

    loadDashboard();
  }, [dispatch]);

  const handleAddInvestment = async (asset) => {
    try {
      await portfolioService.addInvestment({
        asset_name: asset.assetName,
        asset_type: asset.assetType,
        symbol: asset.symbol,
        quantity: 1,
        buy_price: asset.buyPrice || asset.currentPrice,
        current_price: asset.currentPrice,
        risk_level: asset.riskLevel,
        sector: asset.sector,
        notes: asset.description,
      });
    } catch {
      // fall back to optimistic local update
    }

    dispatch(addInvestment({ ...asset, quantity: 1 }));
    toast.success('Investment Added Successfully');
  };

  const handleToggleWatchlist = (asset) => {
    dispatch(toggleWatchlist(asset.id));
    toast.success(watchlist.includes(asset.id) ? `${asset.assetName} removed from watchlist` : `${asset.assetName} added to watchlist`);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      portfolioService.assets(),
      transactionService.list({ per_page: 20 }),
      portfolioService.riskAnalysis(),
      adviceService.list(),
    ])
      .then(([assetsRes, transactionsRes]) => {
        dispatch(hydratePortfolioData({
          assets: assetsRes.data.data,
          transactions: transactionsRes.data.data?.data || transactionsRes.data.data || [],
        }));
        dispatch(refreshInsights());
        dispatch(markAllNotificationsRead());
        toast.success('Dashboard refreshed!');
      })
      .catch(() => {
        dispatch(refreshInsights());
        dispatch(markAllNotificationsRead());
        toast.success('Dashboard refreshed!');
      })
      .finally(() => setTimeout(() => setRefreshing(false), 450));
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return transactions.filter((transaction) => {
      const createdAt = new Date(transaction.created_at || transaction.createdAt || '1970-01-01T00:00:00.000Z');
      const profitLoss = Number(transaction.profit_loss || transaction.amount || 0);

      if (transactionFilter === 'today' && createdAt < startOfDay) return false;
      if (transactionFilter === 'week' && createdAt < startOfWeek) return false;
      if (transactionFilter === 'month' && createdAt < startOfMonth) return false;
      if (transactionFilter === 'profit' && profitLoss < 0) return false;
      if (transactionFilter === 'loss' && profitLoss >= 0) return false;
      if (transactionFilter === 'buy' && transaction.action !== 'buy') return false;
      if (transactionFilter === 'sell' && transaction.action !== 'sell') return false;
      return true;
    });
  }, [transactions, transactionFilter]);

  const allocationData = summary.assetAllocation.map((entry, index) => ({
    name: entry.name,
    value: Math.round(entry.current),
    percentage: Math.round(entry.percentage),
    fill: COLORS[index % COLORS.length],
  }));

  const riskDistributionData = summary.riskDistribution.map((entry, index) => ({
    name: entry.name.toUpperCase(),
    value: entry.value,
    fill: COLORS[index % COLORS.length],
  }));

  const profitLossData = summary.profitLossByAsset.slice(0, 6).map((entry, index) => ({
    name: entry.name,
    profitLoss: Math.round(entry.profitLoss),
    fill: entry.profitLoss >= 0 ? COLORS[index % COLORS.length] : '#EF4444',
  }));

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.18)',
              color: '#A5B4FC',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            <SparklineIcon /> AI-powered investment cockpit
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'Investor'}.
          </motion.h1>
          <p className="section-subtitle">
            Your dashboard now shows live-style dummy investing insights, trend picks, alerts, and risk signals in one premium view.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <NotificationBell
            notifications={notifications}
            onMarkRead={(id) => dispatch(markNotificationRead(id))}
            onMarkAllRead={() => dispatch(markAllNotificationsRead())}
          />
          <Button variant="secondary" onClick={handleRefresh} loading={refreshing} size="sm">
            <RefreshCw size={14} /> Refresh
          </Button>
          <Link to="/portfolio">
            <Button size="sm">
              <Plus size={14} /> Open Portfolio
            </Button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {loading ? (
          Array(4).fill(0).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          <>
            <StatCard
              title="Total Investment"
              value={animatedInvestment}
              prefix="₹"
              icon={DollarSign}
              color="#6366F1"
              trendValue={`${summary.totalInvestment ? assets.length : 0} assets`}
              trend="neutral"
            />
            <StatCard
              title="Portfolio Value"
              value={animatedCurrentValue}
              prefix="₹"
              icon={TrendingUp}
              color="#8B5CF6"
              trendValue={formatPercent(summary.roi)}
              trend={summary.totalProfitLoss >= 0 ? 'up' : 'down'}
            />
            <StatCard
              title="Profit / Loss"
              value={animatedProfitLoss}
              prefix={`${summary.totalProfitLoss >= 0 ? '+' : '-'}₹`}
              icon={summary.totalProfitLoss >= 0 ? TrendingUp : TrendingDown}
              color={summary.totalProfitLoss >= 0 ? '#22C55E' : '#EF4444'}
              trendValue={`ROI: ${formatPercent(summary.roi)}`}
              trend={summary.totalProfitLoss >= 0 ? 'up' : 'down'}
            />
            <StatCard
              title="Risk Score"
              value={summary.riskScore}
              suffix="/100"
              icon={Shield}
              color="#F59E0B"
              trendValue={summary.riskLevel === 'low' ? 'Low Risk' : summary.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk'}
              trend="neutral"
            />
          </>
        )}
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: 24, marginBottom: 4 }}>Top Trending Assets</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>Quick rows for the most active assets with instant add and detail actions.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RiskBadge level={summary.riskLevel} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{summary.riskScore}/100 risk score</span>
          </div>
        </div>

        <GlassCard hover={false} style={{ padding: 0, overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 980 }}>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Symbol</th>
                <th>Current Price</th>
                <th>Daily Growth</th>
                <th>Risk</th>
                <th>ROI</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trendingAssets.map((asset, index) => (
                <motion.tr
                  key={asset.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveAsset(asset)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(99,102,241,0.14)', display: 'grid', placeItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#C4B5FD', fontSize: 12 }}>{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{asset.assetName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.sector}</div>
                      </div>
                    </div>
                  </td>
                  <td>{asset.symbol}</td>
                  <td>{formatCurrency(asset.currentPrice)}</td>
                  <td style={{ color: asset.growth >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>{formatPercent(asset.growth)}</td>
                  <td><RiskBadge level={asset.riskLevel} /></td>
                  <td>{formatPercent(asset.roi)}</td>
                  <td>{asset.assetType.toUpperCase()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <Button size="sm" onClick={(event) => { event.stopPropagation(); handleAddInvestment(asset); }}>Quick Add</Button>
                      <Button variant="secondary" size="sm" onClick={(event) => { event.stopPropagation(); setActiveAsset(asset); }}>View</Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>

    <div
  style={{
    display: 'grid',
    gridTemplateColumns:
      window.innerWidth <= 768
        ? '1fr'
        : 'repeat(2, minmax(0, 1fr))',
    gap: 20,
    marginBottom: 24,
    alignItems: 'stretch',
  }}
>
  <GlassCard hover={false} style={{ padding: 24 }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          Portfolio Growth
        </h3>

        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Dummy growth curve for the current holdings
        </p>
      </div>

      <Activity size={18} color="#6366F1" />
    </div>

    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={summary.monthlyPerformance}>
        <defs>
          <linearGradient
            id="dashboard-investment-grad"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>

          <linearGradient
            id="dashboard-value-grad"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
        />

        <XAxis
          dataKey="month"
          tick={{ fill: '#64748B', fontSize: 11 }}
        />

        <YAxis
          tick={{ fill: '#64748B', fontSize: 11 }}
          tickFormatter={(value) =>
            `₹${(value / 1000).toFixed(0)}K`
          }
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="investment"
          name="Investment"
          stroke="#6366F1"
          strokeWidth={2}
          fill="url(#dashboard-investment-grad)"
          dot={false}
        />

        <Area
          type="monotone"
          dataKey="value"
          name="Value"
          stroke="#22C55E"
          strokeWidth={2}
          fill="url(#dashboard-value-grad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </GlassCard>

  <GlassCard hover={false} style={{ padding: 24 }}>
    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
      Asset Allocation
    </h3>

    <p
      style={{
        fontSize: 12,
        color: 'var(--text-muted)',
        marginBottom: 16,
      }}
    >
      Distribution by asset class
    </p>

    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={allocationData}
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={88}
          dataKey="value"
          strokeWidth={0}
        >
          {allocationData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>

        <Tooltip formatter={(value) => formatCurrency(value)} />

        <Legend verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  </GlassCard>

  <GlassCard hover={false} style={{ padding: 24 }}>
    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
      Risk Distribution
    </h3>

    <p
      style={{
        fontSize: 12,
        color: 'var(--text-muted)',
        marginBottom: 16,
      }}
    >
      Count of holdings grouped by risk
    </p>

    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={riskDistributionData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
        />

        <XAxis
          dataKey="name"
          tick={{ fill: '#64748B', fontSize: 11 }}
        />

        <YAxis
          tick={{ fill: '#64748B', fontSize: 11 }}
          allowDecimals={false}
        />

        <Tooltip />

        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
          {riskDistributionData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </GlassCard>

  <GlassCard hover={false} style={{ padding: 24 }}>
    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
      Profit / Loss Analytics
    </h3>

    <p
      style={{
        fontSize: 12,
        color: 'var(--text-muted)',
        marginBottom: 16,
      }}
    >
      Best and worst contributing holdings
    </p>

    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={profitLossData}
        layout="vertical"
        margin={{ left: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
        />

        <XAxis
          type="number"
          tick={{ fill: '#64748B', fontSize: 11 }}
        />

        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: '#64748B', fontSize: 11 }}
          width={54}
        />

        <Tooltip formatter={(value) => formatCurrency(value)} />

        <Bar dataKey="profitLoss" radius={[0, 10, 10, 0]}>
          {profitLossData.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </GlassCard>
</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <GlassCard hover={false} style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Recent Transactions</h3>
            <Link to="/portfolio" style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none' }}>View full portfolio →</Link>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {['all', 'today', 'week', 'month', 'profit', 'loss', 'buy', 'sell'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTransactionFilter(filter)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: transactionFilter === filter ? 'rgba(99,102,241,0.16)' : 'rgba(255,255,255,0.03)',
                  color: transactionFilter === filter ? '#E0E7FF' : 'var(--text-muted)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {filter === 'all' ? 'All' : filter[0].toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {filteredTransactions.slice(0, 5).map((transaction) => {
              const isBuy = transaction.action === 'buy';
              const pnl = Number(transaction.profit_loss || (isBuy ? transaction.amount * 0.08 : -transaction.amount * 0.04));
              return (
                <motion.button
                  key={transaction.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedTransaction(transaction)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.3fr repeat(4, minmax(0, 1fr))',
                    gap: 12,
                    textAlign: 'left',
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    color: 'inherit',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{transaction.asset_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{transaction.symbol}</div>
                  </div>
                  <div style={{ color: isBuy ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>{isBuy ? 'Buy' : 'Sell'}</div>
                  <div style={{ fontWeight: 700 }}>{formatCurrency(transaction.amount)}</div>
                  <div style={{ color: pnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>{pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{formatDate(transaction.created_at)}</div>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard hover={false} style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>
              <Lightbulb size={16} style={{ display: 'inline', marginRight: 8, color: '#F59E0B' }} />
              Smart Advice
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Updated from portfolio allocation</span>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {smartAdvice.map((advice) => (
              <div
                key={advice.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 16,
                  background: advice.risk_level === 'high' ? 'rgba(239,68,68,0.08)' : advice.risk_level === 'low' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${advice.risk_level === 'high' ? 'rgba(239,68,68,0.2)' : advice.risk_level === 'low' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <RiskBadge level={advice.risk_level} />
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{advice.message}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <AssetDetailModal
        asset={activeAsset}
        isOpen={!!activeAsset}
        onClose={() => setActiveAsset(null)}
        onAddToPortfolio={handleAddInvestment}
        onToggleWatchlist={handleToggleWatchlist}
        isWatchlisted={!!activeAsset && watchlist.includes(activeAsset.id)}
      />

      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
        maxWidth={680}
      >
        {selectedTransaction && (
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
              <InfoTile label="Transaction ID" value={selectedTransaction.id} />
              <InfoTile label="Asset" value={selectedTransaction.asset_name} />
              <InfoTile label="Quantity" value={selectedTransaction.quantity || 1} />
              <InfoTile label="Type" value={selectedTransaction.action?.toUpperCase()} />
              <InfoTile label="Amount" value={formatCurrency(selectedTransaction.amount)} />
              <InfoTile label="Timestamp" value={formatDate(selectedTransaction.created_at)} />
            </div>
            <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Notes</div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {selectedTransaction.notes || 'Dummy transaction created from live portfolio actions and backend synced events.'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SparklineIcon() {
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C4B5FD', boxShadow: '0 0 0 5px rgba(196,181,253,0.15)' }} />;
}

function InfoTile({ label, value }) {
  return (
    <div style={{ padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}
