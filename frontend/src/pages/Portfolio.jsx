import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Sparkles,
  Star,
  Clock3,
  TrendingUp,
  Activity,
  Target,
  Shield,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, CartesianGrid, Cell, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { GlassCard, Button, Modal, EmptyState, RiskBadge, AssetTypeBadge, ProfitLoss } from '../components/UI';
import { AssetAvatar, AssetDetailModal } from '../components/InvestmentWidgets';
import { portfolioService, transactionService } from '../services';
import {
  addInvestment,
  hydratePortfolioData,
  removeInvestment,
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
  trendingAssets as marketTrendingAssets,
} from '../data/investmentData';
import { formatCurrency, formatDate, formatNumber, formatPercent } from '../utils/format';

const assetClassOptions = [
  { label: 'All Asset Classes', value: 'all' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Stocks', value: 'stocks' },
  { label: 'ETF', value: 'etf' },
  { label: 'Mutual Funds', value: 'mutual_funds' },
  { label: 'Commodities', value: 'commodities' },
];

const manualAssetTypeOptions = [
  { label: 'Stocks', value: 'stocks' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Gold', value: 'gold' },
  { label: 'Bonds', value: 'bonds' },
  { label: 'Mutual Funds', value: 'mutual_funds' },
];

const performanceOptions = [
  { label: 'All Performance', value: 'all' },
  { label: 'Top Gainers', value: 'top_gainers' },
  { label: 'Top Losers', value: 'top_losers' },
  { label: 'Positive ROI', value: 'positive_roi' },
  { label: 'Negative ROI', value: 'negative_roi' },
];

const riskOptions = [
  { label: 'All Risk Levels', value: 'all' },
  { label: 'Low Risk', value: 'low' },
  { label: 'Medium Risk', value: 'medium' },
  { label: 'High Risk', value: 'high' },
];

const sortOptions = [
  { label: 'Highest Profit', value: 'highest_profit' },
  { label: 'Lowest Profit', value: 'lowest_profit' },
  { label: 'Highest Investment', value: 'highest_investment' },
  { label: 'Alphabetical', value: 'alphabetical' },
];

function QuickAddModal({ isOpen, onClose, assets, onAddInvestment, onOpenAsset }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Add Investment" maxWidth={760}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 18 }}>
        Add one of the top trending market assets instantly. Each click updates your dashboard totals and recent activity.
      </p>
      <div style={{ display: 'grid', gap: 12 }}>
        {assets.map((asset) => (
          <div
            key={asset.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              justifyContent: 'space-between',
              padding: 14,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{asset.assetName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.symbol} · {formatCurrency(asset.currentPrice)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button variant="secondary" size="sm" onClick={() => onOpenAsset(asset)}>View</Button>
              <Button size="sm" onClick={() => onAddInvestment(asset)}>Add</Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function ManualAddModal({ isOpen, onClose, onSubmit, form, setForm, loading, errors }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Investment Manually" maxWidth={720}>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          <div>
            <label className="form-label">Asset Name</label>
            <input name="asset_name" value={form.asset_name} onChange={handleChange} className="input-field" placeholder="e.g. HDFC Bank" />
            {errors.asset_name && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.asset_name[0]}</p>}
          </div>
          <div>
            <label className="form-label">Symbol</label>
            <input name="symbol" value={form.symbol} onChange={handleChange} className="input-field" placeholder="e.g. HDFCBANK" />
            {errors.symbol && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.symbol[0]}</p>}
          </div>
          <div>
            <label className="form-label">Asset Type</label>
            <select name="asset_type" value={form.asset_type} onChange={handleChange} className="select-field">
              {manualAssetTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.asset_type && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.asset_type[0]}</p>}
          </div>
          <div>
            <label className="form-label">Risk Level</label>
            <select name="risk_level" value={form.risk_level} onChange={handleChange} className="select-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.risk_level && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.risk_level[0]}</p>}
          </div>
          <div>
            <label className="form-label">Quantity</label>
            <input name="quantity" type="number" min="0.0001" step="0.0001" value={form.quantity} onChange={handleChange} className="input-field" placeholder="1" />
            {errors.quantity && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.quantity[0]}</p>}
          </div>
          <div>
            <label className="form-label">Buy Price</label>
            <input name="buy_price" type="number" min="0.01" step="0.01" value={form.buy_price} onChange={handleChange} className="input-field" placeholder="1000" />
            {errors.buy_price && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.buy_price[0]}</p>}
          </div>
          <div>
            <label className="form-label">Current Price</label>
            <input name="current_price" type="number" min="0.01" step="0.01" value={form.current_price} onChange={handleChange} className="input-field" placeholder="1000" />
            {errors.current_price && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.current_price[0]}</p>}
          </div>
          <div>
            <label className="form-label">Purchase Date</label>
            <input name="purchase_date" type="date" value={form.purchase_date} onChange={handleChange} className="input-field" />
            {errors.purchase_date && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.purchase_date[0]}</p>}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="input-field"
            placeholder="Optional notes about this investment"
            style={{ minHeight: 100, resize: 'vertical' }}
          />
          {errors.notes && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.notes[0]}</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 22 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Add Investment</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Portfolio() {
  const dispatch = useDispatch();
  const assets = useSelector(selectPortfolioAssets);
  const notifications = useSelector(selectPortfolioNotifications);
  const transactions = useSelector(selectPortfolioTransactions);
  const watchlist = useSelector(selectWatchlist);

  const [search, setSearch] = useState('');
  const [assetClass, setAssetClass] = useState('all');
  const [performance, setPerformance] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');
  const [sortBy, setSortBy] = useState('highest_profit');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [manualAddOpen, setManualAddOpen] = useState(false);
  const [manualAddLoading, setManualAddLoading] = useState(false);
  const [manualAddErrors, setManualAddErrors] = useState({});
  const [manualForm, setManualForm] = useState({
    asset_name: '',
    symbol: '',
    asset_type: 'stocks',
    risk_level: 'medium',
    quantity: '1',
    buy_price: '',
    current_price: '',
    purchase_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  const summary = useMemo(() => calculatePortfolioSummary(assets), [assets]);
  const smartAdvice = useMemo(() => generateSmartAdvice(assets), [assets]);
  const portfolioTrendingAssets = useMemo(() => getTopTrendingAssets(assets), [assets]);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const [assetsRes, transactionsRes] = await Promise.all([
          portfolioService.list({ per_page: 1000 }),
          transactionService.list({ per_page: 30 }),
        ]);

        dispatch(hydratePortfolioData({
          assets: assetsRes.data.data?.data || assetsRes.data.data || [],
          transactions: transactionsRes.data.data?.data || transactionsRes.data.data || [],
        }));
      } catch {
        // fallback to the current state when the API is unavailable
      }
    };

    loadPortfolio();
  }, [dispatch]);

  const filteredAssets = useMemo(() => {
    let result = [...assets];
    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((asset) =>
        asset.assetName.toLowerCase().includes(query) ||
        asset.symbol.toLowerCase().includes(query)
      );
    }

    if (assetClass !== 'all') {
      result = result.filter((asset) => asset.assetType === assetClass);
    }

    if (riskLevel !== 'all') {
      result = result.filter((asset) => asset.riskLevel === riskLevel);
    }

    if (performance === 'top_gainers') {
      result = result.filter((asset) => asset.roi >= 0).sort((a, b) => b.roi - a.roi);
    } else if (performance === 'top_losers') {
      result = result.filter((asset) => asset.roi < 0).sort((a, b) => a.roi - b.roi);
    } else if (performance === 'positive_roi') {
      result = result.filter((asset) => asset.roi >= 0);
    } else if (performance === 'negative_roi') {
      result = result.filter((asset) => asset.roi < 0);
    }

    switch (sortBy) {
      case 'highest_profit':
        result.sort((a, b) => (b.currentValue - b.investedAmount) - (a.currentValue - a.investedAmount));
        break;
      case 'lowest_profit':
        result.sort((a, b) => (a.currentValue - a.investedAmount) - (b.currentValue - b.investedAmount));
        break;
      case 'highest_investment':
        result.sort((a, b) => b.investedAmount - a.investedAmount);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.assetName.localeCompare(b.assetName));
        break;
      default:
        break;
    }

    return result;
  }, [assets, search, assetClass, performance, riskLevel, sortBy]);

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
        notes: asset.description,
      });
    } catch {
      // fallback to local state when the API is unavailable
    }

    dispatch(addInvestment({ ...asset, quantity: 1 }));
    toast.success('Investment Added Successfully');
  };

  const handleManualAddInvestment = async (event) => {
    event.preventDefault();
    setManualAddLoading(true);
    setManualAddErrors({});

    const payload = {
      asset_name: manualForm.asset_name.trim(),
      symbol: manualForm.symbol.trim().toUpperCase(),
      asset_type: manualForm.asset_type,
      quantity: Number(manualForm.quantity),
      buy_price: Number(manualForm.buy_price),
      current_price: Number(manualForm.current_price || manualForm.buy_price),
      risk_level: manualForm.risk_level,
      purchase_date: manualForm.purchase_date,
      notes: manualForm.notes.trim() || null,
    };

    try {
      const res = await portfolioService.create({
        asset_name: payload.asset_name,
        asset_type: payload.asset_type,
        quantity: payload.quantity,
        buy_price: payload.buy_price,
        current_price: payload.current_price,
        purchase_date: payload.purchase_date,
        notes: payload.notes,
        ticker_symbol: payload.symbol,
      });

      const createdPortfolio = res.data.data;
      dispatch(addInvestment({
        id: createdPortfolio.id,
        assetName: createdPortfolio.asset_name,
        symbol: createdPortfolio.ticker_symbol,
        assetType: createdPortfolio.asset_type,
        quantity: createdPortfolio.quantity,
        buyPrice: createdPortfolio.buy_price,
        currentPrice: createdPortfolio.current_price,
        riskLevel: createdPortfolio.risk_level,
        notes: createdPortfolio.notes,
      }));

      toast.success('Manual investment added successfully');
      setManualAddOpen(false);
      setManualForm({
        asset_name: '',
        symbol: '',
        asset_type: 'stocks',
        risk_level: 'medium',
        quantity: '1',
        buy_price: '',
        current_price: '',
        purchase_date: new Date().toISOString().slice(0, 10),
        notes: '',
      });
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors) {
        setManualAddErrors(errData.errors);
      } else {
        toast.error(errData?.message || 'Failed to add investment');
      }
    } finally {
      setManualAddLoading(false);
    }
  };

  const handleRemoveInvestment = async (asset) => {
    try {
      await portfolioService.removeInvestment(asset.symbol);
    } catch {
      // fallback to local state when the API is unavailable
    }

    dispatch(removeInvestment(asset.id));
    toast.success(`${asset.assetName} removed from portfolio`);
  };

  const handleToggleWatchlist = (asset) => {
    dispatch(toggleWatchlist(asset.id));
    toast.success(watchlist.includes(asset.id) ? `${asset.assetName} removed from watchlist` : `${asset.assetName} added to watchlist`);
  };
  const allocationData = summary.assetAllocation.map((entry, index) => ({
    name: entry.name,
    value: Math.round(entry.current),
    fill: ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B'][index % 5],
  }));

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.18)', color: '#A5B4FC', fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
            <Sparkles size={12} /> Premium portfolio control center
          </div>
          <h1 className="section-title">Portfolio Management</h1>
          <p className="section-subtitle">Browse your holdings, inspect full asset detail, and use smart filters to find the best opportunities.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => setQuickAddOpen(true)}>
            <Plus size={14} /> Quick Add
          </Button>
          <Button variant="secondary" onClick={() => setManualAddOpen(true)}>
            <Plus size={14} /> Add Manually
          </Button>
          <Button onClick={() => setSelectedAsset(portfolioTrendingAssets[0])} disabled={!portfolioTrendingAssets.length}>
            <TrendingUp size={14} /> Highlight Asset
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <SummaryCard label="Total Investment" value={formatCurrency(summary.totalInvestment)} tone="primary" />
        <SummaryCard label="Current Value" value={formatCurrency(summary.totalCurrentValue)} tone="success" />
        <SummaryCard label="Profit / Loss" value={<ProfitLoss value={summary.totalProfitLoss} />} tone={summary.totalProfitLoss >= 0 ? 'success' : 'danger'} />
        <SummaryCard label="Risk Score" value={`${summary.riskScore}/100`} tone="warning" />
      </div>

      <div className="portfolio-page-grid">
        <div style={{ display: 'grid', gap: 20 }}>
          <GlassCard hover={false} style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))', gap: 14, marginBottom: 16 }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search asset name or symbol"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                />
              </div>

              <SelectBlock label="Asset Class" icon={<Filter size={14} />} value={assetClass} onChange={setAssetClass} options={assetClassOptions} />
              <SelectBlock label="Performance" icon={<Activity size={14} />} value={performance} onChange={setPerformance} options={performanceOptions} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginBottom: 18 }}>
              <SelectBlock label="Risk Level" icon={<Shield size={14} />} value={riskLevel} onChange={setRiskLevel} options={riskOptions} />
              <SelectBlock label="Sort By" icon={<ArrowUpDown size={14} />} value={sortBy} onChange={setSortBy} options={sortOptions} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>All Holdings</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filteredAssets.length} assets matching the active filters</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <RiskBadge level={summary.riskLevel} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overall ROI {formatPercent(summary.roi)}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: 0, overflowX: 'auto' }}>
            {filteredAssets.length === 0 ? (
              <div style={{ padding: 24 }}>
                <EmptyState
                  icon={X}
                  title="No holdings found"
                  description="Add your first investment manually or pick one from the trending list."
                  action={(
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button onClick={() => setManualAddOpen(true)}>Add Manually</Button>
                      <Button variant="secondary" onClick={() => setQuickAddOpen(true)}>Quick Add</Button>
                    </div>
                  )}
                />
              </div>
            ) : (
              <table className="data-table" style={{ minWidth: 1180 }}>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Symbol</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Buy Price</th>
                    <th>Current Price</th>
                    <th>Invested</th>
                    <th>Current Value</th>
                    <th>ROI %</th>
                    <th>Risk</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset, index) => {
                    const isHeld = asset.quantity > 0;
                    return (
                      <motion.tr
                        key={asset.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedAsset(asset)}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <AssetAvatar asset={asset} size={40} />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{asset.assetName}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.sector}</div>
                            </div>
                          </div>
                        </td>
                        <td>{asset.symbol}</td>
                        <td><AssetTypeBadge type={asset.assetType} /></td>
                        <td>{formatNumber(asset.quantity)}</td>
                        <td>{asset.buyPrice > 0 ? formatCurrency(asset.buyPrice) : '—'}</td>
                        <td>{formatCurrency(asset.currentPrice)}</td>
                        <td>{formatCurrency(asset.investedAmount)}</td>
                        <td>{formatCurrency(asset.currentValue)}</td>
                        <td>
                          <span style={{ color: asset.roi >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>
                            {formatPercent(asset.roi)}
                          </span>
                        </td>
                        <td><RiskBadge level={asset.riskLevel} /></td>
                        <td>
                          <span style={{
                            padding: '6px 10px',
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: isHeld ? 'rgba(34,197,94,0.14)' : 'rgba(245,158,11,0.14)',
                            color: isHeld ? '#86EFAC' : '#FBBF24',
                          }}>
                            {isHeld ? 'Held' : 'Available'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <Button size="sm" onClick={(event) => { event.stopPropagation(); setSelectedAsset(asset); }}>View</Button>
                            <Button variant="secondary" size="sm" onClick={(event) => { event.stopPropagation(); handleAddInvestment(asset); }}>Add</Button>
                            <Button variant="danger" size="sm" onClick={(event) => { event.stopPropagation(); handleRemoveInvestment(asset); }} disabled={!isHeld}>Remove</Button>
                            <button
                              onClick={(event) => { event.stopPropagation(); handleToggleWatchlist(asset); }}
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 12,
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: watchlist.includes(asset.id) ? 'rgba(245,158,11,0.14)' : 'rgba(255,255,255,0.03)',
                                color: watchlist.includes(asset.id) ? '#FBBF24' : 'var(--text-muted)',
                                cursor: 'pointer',
                              }}
                            >
                              <Star size={14} fill={watchlist.includes(asset.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </GlassCard>
        </div>

        <div className="portfolio-side-grid">
          <GlassCard hover={false} style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Portfolio Summary</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current allocation and health</p>
              </div>
              <Clock3 size={16} color="#6366F1" />
            </div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              <MiniMetric label="Holdings" value={`${assets.length}`} />
              <MiniMetric label="Watchlist" value={`${watchlist.length}`} />
              <MiniMetric label="Notifications" value={`${notifications.filter((notification) => notification.unread).length} unread`} />
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={54} outerRadius={84} dataKey="value" strokeWidth={0}>
                  {allocationData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: 22 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Risk Analysis</h3>
            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              <MiniMetric label="Overall Risk" value={`${summary.riskLevel.toUpperCase()} · ${summary.riskScore}/100`} />
              <MiniMetric label="Crypto Exposure" value={`${summary.cryptoWeight.toFixed(1)}%`} />
              <MiniMetric label="High Risk Share" value={`${summary.highRiskShare.toFixed(1)}%`} />
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={summary.riskDistribution.map((item) => ({ name: item.name.toUpperCase(), value: item.value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: 22 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Recent Transactions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {transactions.slice(0, 6).map((transaction) => {
                const isBuy = transaction.action === 'buy';
                const pnl = Number(transaction.profit_loss || (isBuy ? transaction.amount * 0.08 : -transaction.amount * 0.04));
                return (
                  <motion.button
                    key={transaction.id}
                    whileHover={{ y: -3 }}
                    onClick={() => setSelectedTransaction(transaction)}
                    style={{
                      textAlign: 'left',
                      padding: 14,
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      color: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{transaction.asset_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{transaction.symbol}</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: isBuy ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {isBuy ? 'Buy' : 'Sell'}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>Qty</span><span>{transaction.quantity || 1}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>P/L</span><span style={{ color: pnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>{pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>Date</span><span>{formatDate(transaction.created_at)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>Status</span><span>Executed</span></div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard hover={false} style={{ padding: 22 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Smart Advice</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {smartAdvice.slice(0, 3).map((advice) => (
                <div key={advice.id} style={{ padding: 14, borderRadius: 16, background: advice.risk_level === 'high' ? 'rgba(239,68,68,0.08)' : advice.risk_level === 'low' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${advice.risk_level === 'high' ? 'rgba(239,68,68,0.2)' : advice.risk_level === 'low' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <RiskBadge level={advice.risk_level} />
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{advice.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} className="portfolio-actions-card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              <Button onClick={() => setQuickAddOpen(true)}>
                <Plus size={14} /> Quick Add Investment
              </Button>
              <Button variant="secondary" onClick={() => setSelectedAsset(portfolioTrendingAssets[0])}>
                <Target size={14} /> Open Top Asset
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      <AssetDetailModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onAddToPortfolio={handleAddInvestment}
        onToggleWatchlist={handleToggleWatchlist}
        isWatchlisted={!!selectedAsset && watchlist.includes(selectedAsset.id)}
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
              <InfoTile label="Type" value={(selectedTransaction.action || 'buy').toUpperCase()} />
              <InfoTile label="Buy Price" value={selectedTransaction.price ? formatCurrency(selectedTransaction.price) : formatCurrency(selectedTransaction.amount)} />
              <InfoTile label="Current Price" value={formatCurrency(selectedTransaction.current_price || selectedTransaction.amount)} />
              <InfoTile label="ROI" value={formatPercent(selectedTransaction.roi || 0)} />
              <InfoTile label="Timestamp" value={formatDate(selectedTransaction.created_at)} />
            </div>
            <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Notes</div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {selectedTransaction.notes || 'This transaction was synced from the portfolio activity feed and can be used to review buy/sell performance.'}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        assets={marketTrendingAssets}
        onAddInvestment={handleAddInvestment}
        onOpenAsset={(asset) => setSelectedAsset(asset)}
      />

      <ManualAddModal
        isOpen={manualAddOpen}
        onClose={() => setManualAddOpen(false)}
        onSubmit={handleManualAddInvestment}
        form={manualForm}
        setForm={setManualForm}
        loading={manualAddLoading}
        errors={manualAddErrors}
      />
    </div>
  );
}

function SummaryCard({ label, value, tone = 'primary' }) {
  const colors = {
    primary: 'rgba(99,102,241,0.08)',
    success: 'rgba(34,197,94,0.08)',
    danger: 'rgba(239,68,68,0.08)',
    warning: 'rgba(245,158,11,0.08)',
  };

  return (
    <GlassCard hover={false} style={{ padding: 18, background: colors[tone] }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{value}</div>
    </GlassCard>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function SelectBlock({ label, icon, value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {icon}
        {label}
      </div>
      <select
        className="select-field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div style={{ padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}
