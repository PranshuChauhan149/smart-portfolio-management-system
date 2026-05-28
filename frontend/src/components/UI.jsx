import { motion } from 'framer-motion';

export function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
    </div>
  );
}

export function GlassCard({ children, className = '', hover = true, onClick, style }) {
  return (
    <motion.div
      className={`${hover ? 'glass-card' : 'glass-card-static'} ${className}`}
      onClick={onClick}
      style={style}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ title, value, icon: Icon, trend, trendValue, color = '#6366F1', prefix = '', suffix = '', loading = false }) {
  const isPositive = trend === 'up';
  const isNeutral = trend === 'neutral';

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '8px' }}>
            {title}
          </p>
          {loading ? (
            <div className="skeleton" style={{ width: 120, height: 32, marginBottom: 8 }} />
          ) : (
            <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : value}{suffix}
            </h3>
          )}
          {trendValue !== undefined && !loading && (
            <p style={{
              fontSize: '13px',
              color: isNeutral ? 'var(--text-muted)' : isPositive ? 'var(--color-success)' : 'var(--color-danger)',
              fontWeight: 500,
              marginTop: '4px'
            }}>
              {isPositive ? '↑' : isNeutral ? '→' : '↓'} {trendValue}
            </p>
          )}
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}20`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {Icon && <Icon size={22} color={color} />}
        </div>
      </div>
    </motion.div>
  );
}

export function Badge({ type = 'info', children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

export function RiskBadge({ level }) {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  };
  return <Badge type={colors[level] || 'info'}>{level?.toUpperCase()}</Badge>;
}

export function AssetTypeBadge({ type }) {
  const labels = {
    stocks: 'Stocks',
    crypto: 'Crypto',
    etf: 'ETF',
    mutual_funds: 'Mutual Funds',
    commodities: 'Commodities',
    gold: 'Gold',
    bonds: 'Bonds',
  };
  return <Badge type="primary">{labels[type] || type}</Badge>;
}

export function LoadingSpinner({ size = 40 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card-static" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 120, height: 16 }} />
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
      </div>
      <div className="skeleton" style={{ width: 160, height: 32, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: 80, height: 14 }} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center', padding: '60px 20px' }}
    >
      {Icon && (
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Icon size={36} color="#6366F1" />
        </div>
      )}
      <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>{description}</p>
      {action}
    </motion.div>
  );
}

export function ProfitLoss({ value, prefix = '₹', showPercent = false }) {
  const isPositive = value >= 0;
  return (
    <span style={{ color: isPositive ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
      {isPositive ? '+' : ''}{prefix}{Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
      {showPercent && ` (${Math.abs(value).toFixed(2)}%)`}
    </span>
  );
}

export function Button({ children, variant = 'primary', onClick, disabled, loading, type = 'button', size = 'md', style }) {
  const classes = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
  };

  return (
    <motion.button
      type={type}
      className={classes[variant]}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      style={{
        ...sizes[size],
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        ...style,
      }}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <span style={{
            width: 16, height: 16,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            display: 'inline-block'
          }} />
          Loading...
        </span>
      ) : children}
    </motion.button>
  );
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 520 }) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal-content"
        style={{ maxWidth }}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
            <button
              onClick={onClose}
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: 18,
                transition: 'all 0.2s',
              }}
            >
              ×
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
}

export function InputField({ label, id, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <input id={id} className="input-field" {...props} />
      {error && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export function SelectField({ label, id, error, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <select id={id} className="select-field" {...props}>
        {children}
      </select>
      {error && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{error}</p>}
    </div>
  );
}
