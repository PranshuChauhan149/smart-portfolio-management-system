import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Bookmark,
  BookmarkCheck,
  CircleDollarSign,
  Coins,
  Eye,
  PlusCircle,
  Bitcoin,
  Apple,
  Building2,
  Landmark,
  Leaf,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button, Modal, RiskBadge, AssetTypeBadge, ProfitLoss, GlassCard } from './UI';
import { formatCurrency, formatPercent, formatDate } from '../utils/format';

function renderAssetIcon(asset, size = 18, color = 'white') {
  const iconKey = asset?.iconKey;

  switch (iconKey) {
    case 'bitcoin':
      return <Bitcoin size={size} color={color} />;
    case 'ethereum':
      return <Coins size={size} color={color} />;
    case 'solana':
      return <Sparkles size={size} color={color} />;
    case 'apple':
      return <Apple size={size} color={color} />;
    case 'car':
      return <TrendingUp size={size} color={color} />;
    case 'chip':
      return <CircleDollarSign size={size} color={color} />;
    case 'server':
      return <Building2 size={size} color={color} />;
    case 'search':
      return <Eye size={size} color={color} />;
    case 'gold':
    case 'silver':
      return <CircleDollarSign size={size} color={color} />;
    case 'building':
      return <Building2 size={size} color={color} />;
    case 'computer':
      return <CircleDollarSign size={size} color={color} />;
    case 'bank':
      return <Landmark size={size} color={color} />;
    case 'fund':
      return <ShieldAlert size={size} color={color} />;
    default: {
      switch (asset?.assetType) {
        case 'crypto':
          return <Bitcoin size={size} color={color} />;
        case 'stocks':
          return <TrendingUp size={size} color={color} />;
        case 'etf':
          return <ShieldAlert size={size} color={color} />;
        case 'mutual_funds':
          return <Coins size={size} color={color} />;
        case 'commodities':
          return <Leaf size={size} color={color} />;
        default:
          return <CircleDollarSign size={size} color={color} />;
      }
    }
  }
}

export function AssetAvatar({ asset, size = 48 }) {
  const gradients = {
    crypto: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(56,189,248,0.35))',
    stocks: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(99,102,241,0.35))',
    etf: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(251,191,36,0.35))',
    mutual_funds: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(168,85,247,0.3))',
    commodities: 'linear-gradient(135deg, rgba(180,83,9,0.22), rgba(245,158,11,0.3))',
  };

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: Math.max(16, size / 3),
      background: gradients[asset?.assetType] || gradients.stocks,
      border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
      flexShrink: 0,
    }}>
      {renderAssetIcon(asset, Math.max(18, size / 2.5), 'white')}
    </div>
  );
}

function MetricChip({ label, value, tone = 'default' }) {
  const colors = {
    default: 'rgba(148,163,184,0.12)',
    success: 'rgba(34,197,94,0.14)',
    warning: 'rgba(245,158,11,0.14)',
    danger: 'rgba(239,68,68,0.14)',
  };

  const text = {
    default: 'var(--text-secondary)',
    success: 'var(--color-success)',
    warning: '#F59E0B',
    danger: 'var(--color-danger)',
  };

  return (
    <div style={{
      padding: '10px 12px',
      borderRadius: 14,
      background: colors[tone],
      border: '1px solid rgba(255,255,255,0.08)',
      minWidth: 0,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: text[tone], lineHeight: 1.2 }}>{value}</div>
    </div>
  );
}

export function TrendingAssetCard({ asset, onAdd, onOpen, isInWatchlist, onToggleWatchlist }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={() => onOpen?.(asset)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 24,
        padding: 1,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.45), rgba(56,189,248,0.18), rgba(168,85,247,0.45))',
      }}
    >
      <div className="glass-card-static" style={{
        padding: 18,
        borderRadius: 23,
        height: '100%',
        background: 'linear-gradient(180deg, rgba(15,23,42,0.94), rgba(15,23,42,0.82))',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(56,189,248,0.22))',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {renderAssetIcon(asset, 22, '#E2E8F0')}
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.assetName}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 0.4 }}>{asset.symbol}</p>
            </div>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleWatchlist?.(asset);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: isInWatchlist ? '#FBBF24' : 'var(--text-muted)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            {isInWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current Price</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(asset.currentPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Daily Growth</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: asset.growth >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {formatPercent(asset.growth)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Risk Level</span>
            <RiskBadge level={asset.riskLevel} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <AssetTypeBadge type={asset.assetType} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ROI: {formatPercent(asset.roi)}</span>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              onAdd?.(asset);
            }}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <PlusCircle size={14} /> Add Investment
          </Button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onOpen?.(asset);
            }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function AssetDetailModal({ asset, isOpen, onClose, onAddToPortfolio, onToggleWatchlist, isWatchlisted }) {
  if (!asset) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${asset.assetName} · ${asset.symbol}`} maxWidth={980}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{
              width: 70,
              height: 70,
              borderRadius: 22,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(56,189,248,0.24))',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {renderAssetIcon(asset, 30, '#E2E8F0')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{asset.assetName}</h3>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <AssetTypeBadge type={asset.assetType} />
                <RiskBadge level={asset.riskLevel} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.sector}</span>
              </div>
            </div>
          </div>

          <GlassCard hover={false} style={{ padding: 18, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
              <MetricChip label="Current Price" value={formatCurrency(asset.currentPrice)} tone="success" />
              <MetricChip label="ROI" value={formatPercent(asset.roi)} tone={asset.roi >= 0 ? 'success' : 'danger'} />
              <MetricChip label="Market Cap" value={asset.marketCap} tone="warning" />
              <MetricChip label="Volatility" value={asset.volatility} tone={asset.volatility.toLowerCase().includes('high') ? 'danger' : 'default'} />
            </div>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: 18, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Historical Performance</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Dummy monthly growth curve for presentation-ready analytics</p>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(asset.lastUpdated)}</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={asset.history || []}>
                <defs>
                  <linearGradient id={`asset-grad-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fill={`url(#asset-grad-${asset.id})`} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: 18 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Investment Suggestion</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{asset.description}</p>
          </GlassCard>
        </div>

        <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          <GlassCard hover={false} style={{ padding: 18 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Key Facts</h4>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: 'var(--text-muted)' }}>Invested</span><span style={{ fontWeight: 700 }}>{formatCurrency(asset.investedAmount)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: 'var(--text-muted)' }}>Current Value</span><span style={{ fontWeight: 700 }}>{formatCurrency(asset.currentValue)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: 'var(--text-muted)' }}>Quantity</span><span style={{ fontWeight: 700 }}>{asset.quantity}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: 'var(--text-muted)' }}>Buy Price</span><span style={{ fontWeight: 700 }}>{formatCurrency(asset.buyPrice)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span style={{ color: 'var(--text-muted)' }}>Profit / Loss</span><ProfitLoss value={asset.currentValue - asset.investedAmount} /></div>
            </div>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: 18 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Risk Snapshot</h4>
            <div style={{ display: 'grid', gap: 10 }}>
              <MetricChip label="Risk Level" value={asset.riskLevel.toUpperCase()} tone={asset.riskLevel} />
              <MetricChip label="Volatility" value={asset.volatility} tone={asset.volatility.toLowerCase().includes('high') ? 'danger' : 'default'} />
              <MetricChip label="Target Price" value={formatCurrency(asset.targetPrice)} tone="warning" />
            </div>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: 18 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Actions</h4>
            <div style={{ display: 'grid', gap: 10 }}>
              <Button onClick={() => onAddToPortfolio?.(asset)} style={{ width: '100%', justifyContent: 'center' }}>
                <PlusCircle size={14} /> Add To Portfolio
              </Button>
              <Button variant="secondary" onClick={() => onToggleWatchlist?.(asset)} style={{ width: '100%', justifyContent: 'center' }}>
                {isWatchlisted ? <BookmarkCheck size={14} /> : <Bookmark size={14} />} {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </Modal>
  );
}

export function NotificationBell({ notifications = [], onMarkAllRead, onMarkRead, onNotificationClick }) {
  const [open, setOpen] = useState(false);
  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((current) => !current)}
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          color: 'var(--text-primary)',
          position: 'relative',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#F97316',
            boxShadow: '0 0 0 3px rgba(249,115,22,0.2)',
          }} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              width: 360,
              maxWidth: '90vw',
              borderRadius: 24,
              padding: 16,
              background: 'linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.92))',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 30px 80px rgba(15,23,42,0.45)',
              zIndex: 30,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unreadCount} unread updates</p>
              </div>
              <button
                onClick={() => onMarkAllRead?.()}
                style={{ fontSize: 12, color: '#8B5CF6', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Mark all read
              </button>
            </div>

            <div style={{ display: 'grid', gap: 10, maxHeight: 360, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No notifications yet.</div>
              ) : (
                notifications.slice(0, 6).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => {
                      onNotificationClick?.(notification);
                      onMarkRead?.(notification.id);
                      setOpen(false);
                    }}
                    style={{
                      textAlign: 'left',
                      width: '100%',
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: notification.unread ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                      borderRadius: 18,
                      padding: 14,
                      color: 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{notification.title}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(notification.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{notification.message}</p>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
