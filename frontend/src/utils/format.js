export function formatCurrency(amount, currency = '₹') {
  if (amount === null || amount === undefined) return `${currency}0`;
  return `${currency}${Math.abs(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function formatPercent(value) {
  if (value === null || value === undefined) return '0%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(2)}%`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '0';
  return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 4 });
}

export function formatDistanceToNow(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getRiskColor(level) {
  return {
    low: '#22C55E',
    medium: '#F59E0B',
    high: '#EF4444',
  }[level] || '#6366F1';
}

export function getAssetColor(type) {
  return {
    stocks: '#6366F1',
    crypto: '#F59E0B',
    gold: '#EAB308',
    bonds: '#22C55E',
    mutual_funds: '#06B6D4',
  }[type] || '#6366F1';
}

export function getAssetLabel(type) {
  return {
    stocks: 'Stocks',
    crypto: 'Crypto',
    gold: 'Gold',
    bonds: 'Bonds',
    mutual_funds: 'Mutual Funds',
  }[type] || type;
}
