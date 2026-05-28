import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, RefreshCw, X, AlertCircle } from 'lucide-react';
import { portfolioService } from '../services';
import { GlassCard, Button, InputField, SelectField, Modal, AssetTypeBadge, RiskBadge, EmptyState } from '../components/UI';
import { formatCurrency, formatDate, getAssetLabel } from '../utils/format';
import toast from 'react-hot-toast';

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    asset_name: '',
    asset_type: 'stocks',
    ticker_symbol: '',
    quantity: '',
    buy_price: '',
    current_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchPortfolios();
  }, [search, filterType]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await portfolioService.list({ 
        search, 
        asset_type: filterType,
        per_page: 50 // fetching more for a single page list view
      });
      setPortfolios(res.data.data.data);
    } catch (error) {
      toast.error('Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (asset = null) => {
    setErrors({});
    if (asset) {
      setCurrentAsset(asset);
      setForm({
        asset_name: asset.asset_name,
        asset_type: asset.asset_type,
        ticker_symbol: asset.ticker_symbol || '',
        quantity: asset.quantity,
        buy_price: asset.buy_price,
        current_price: asset.current_price,
        purchase_date: asset.purchase_date.split('T')[0],
        notes: asset.notes || ''
      });
    } else {
      setCurrentAsset(null);
      setForm({
        asset_name: '',
        asset_type: 'stocks',
        ticker_symbol: '',
        quantity: '',
        buy_price: '',
        current_price: '',
        purchase_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setErrors({});
    try {
      if (currentAsset) {
        await portfolioService.update(currentAsset.id, form);
        toast.success('Asset updated successfully');
      } else {
        await portfolioService.create(form);
        toast.success('Asset added successfully');
      }
      setIsModalOpen(false);
      fetchPortfolios();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error('An error occurred');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDeleteModal = (asset) => {
    setCurrentAsset(asset);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setFormLoading(true);
      await portfolioService.delete(currentAsset.id);
      toast.success('Asset sold/removed successfully');
      setIsDeleteModalOpen(false);
      fetchPortfolios();
    } catch (err) {
      toast.error('Failed to remove asset');
    } finally {
      setFormLoading(false);
    }
  };

  const totalInvestment = portfolios.reduce((sum, asset) => sum + Number(asset.buy_price || 0) * Number(asset.quantity || 0), 0);
  const totalCurrentValue = portfolios.reduce((sum, asset) => sum + Number(asset.current_value || 0), 0);
  const totalProfitLoss = portfolios.reduce((sum, asset) => sum + Number(asset.profit_loss || 0), 0);

  return (
    <div className="content-area">
      <div className="portfolio-hero">
        <div>
          <div className="portfolio-subtle-card" style={{ marginBottom: 12 }}>
            <X size={14} style={{ display: 'none' }} />
            Portfolio control center
          </div>
          <h1 className="section-title">Portfolio Management</h1>
          <p className="section-subtitle">Track, edit, and review your investments with a cleaner overview.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} style={{ display: 'inline', marginRight: 8 }} />
          Add Asset
        </Button>
      </div>

      <div className="portfolio-summary-grid">
        <div className="portfolio-summary-card">
          <div className="portfolio-summary-label">Total Investment</div>
          <div className="portfolio-summary-value">{formatCurrency(totalInvestment)}</div>
        </div>
        <div className="portfolio-summary-card">
          <div className="portfolio-summary-label">Current Value</div>
          <div className="portfolio-summary-value">{formatCurrency(totalCurrentValue)}</div>
        </div>
        <div className="portfolio-summary-card">
          <div className="portfolio-summary-label">Profit / Loss</div>
          <div className="portfolio-summary-value" style={{ color: totalProfitLoss >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
          </div>
        </div>
      </div>

      <GlassCard hover={false} style={{ padding: 24, marginBottom: 24 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 40 }}
            />
          </div>
          <div style={{ flex: '0 1 200px', position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select-field"
              style={{ paddingLeft: 40 }}
            >
              <option value="">All Types</option>
              <option value="stocks">Stocks</option>
              <option value="crypto">Crypto</option>
              <option value="gold">Gold</option>
              <option value="bonds">Bonds</option>
              <option value="mutual_funds">Mutual Funds</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto', width: 32, height: 32 }} />
            </div>
          ) : portfolios.length === 0 ? (
            <EmptyState 
              icon={AlertCircle} 
              title="No assets found" 
              description="You haven't added any investments matching your criteria." 
              action={<Button onClick={() => handleOpenModal()}>Add Your First Asset</Button>}
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Qty / Price</th>
                  <th>Current Val</th>
                  <th>P/L</th>
                  <th>Risk</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {portfolios.map((asset) => {
                    const isProfit = asset.profit_loss >= 0;
                    return (
                      <motion.tr 
                        key={asset.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{asset.asset_name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.ticker_symbol || 'N/A'}</div>
                        </td>
                        <td><AssetTypeBadge type={asset.asset_type} /></td>
                        <td>
                          <div>{asset.quantity} units</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Avg: {formatCurrency(asset.buy_price)}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{formatCurrency(asset.current_value)}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            @ {formatCurrency(asset.current_price)}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: isProfit ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {isProfit ? '+' : ''}{formatCurrency(asset.profit_loss)}
                          </div>
                          <div style={{ fontSize: 12, color: isProfit ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {isProfit ? '+' : ''}{asset.roi.toFixed(2)}%
                          </div>
                        </td>
                        <td><RiskBadge level={asset.risk_level} /></td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => handleOpenModal(asset)}
                            style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', marginRight: 8 }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleOpenDeleteModal(asset)}
                            style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAsset ? "Edit Asset" : "Add New Asset"}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <InputField label="Asset Name *" name="asset_name" value={form.asset_name} onChange={handleFormChange} required placeholder="e.g. Apple Inc." error={errors.asset_name?.[0]} />
            <InputField label="Ticker Symbol" name="ticker_symbol" value={form.ticker_symbol} onChange={handleFormChange} placeholder="e.g. AAPL" error={errors.ticker_symbol?.[0]} />
          </div>

          <SelectField label="Asset Type *" name="asset_type" value={form.asset_type} onChange={handleFormChange} required error={errors.asset_type?.[0]}>
            <option value="stocks">Stocks</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="gold">Gold</option>
            <option value="bonds">Bonds</option>
            <option value="mutual_funds">Mutual Funds</option>
          </SelectField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <InputField label="Quantity *" type="number" step="any" name="quantity" value={form.quantity} onChange={handleFormChange} required placeholder="0.00" error={errors.quantity?.[0]} />
            <InputField label="Buy Price (₹) *" type="number" step="any" name="buy_price" value={form.buy_price} onChange={handleFormChange} required placeholder="0.00" error={errors.buy_price?.[0]} />
            <InputField label="Current Price (₹) *" type="number" step="any" name="current_price" value={form.current_price} onChange={handleFormChange} required placeholder="0.00" error={errors.current_price?.[0]} />
          </div>

          <InputField label="Purchase Date *" type="date" name="purchase_date" value={form.purchase_date} onChange={handleFormChange} required error={errors.purchase_date?.[0]} />

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Notes</label>
            <textarea 
              name="notes" 
              value={form.notes} 
              onChange={handleFormChange} 
              className="input-field" 
              style={{ minHeight: 80, resize: 'vertical' }} 
              placeholder="Optional notes..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={formLoading}>{currentAsset ? "Update Asset" : "Add Asset"}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Sell / Remove Asset" maxWidth={400}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Trash2 size={28} color="#EF4444" />
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 8 }}>
            Are you sure you want to remove <strong>{currentAsset?.asset_name}</strong>?
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            This action will record a sell transaction and cannot be undone.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={formLoading} style={{ flex: 1 }}>Remove</Button>
        </div>
      </Modal>
    </div>
  );
}
