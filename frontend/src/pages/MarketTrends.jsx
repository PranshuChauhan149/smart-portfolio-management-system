import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';
import { GlassCard, StatCard } from '../components/UI';
import { formatCurrency } from '../utils/format';

export default function MarketTrends() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      // Using CoinGecko free public API for crypto trends
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'inr',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false
        }
      });
      setCryptoData(res.data);
    } catch (err) {
      console.error('Failed to fetch market data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <h1 className="section-title">Market Trends</h1>
      <p className="section-subtitle">Real-time market data and insights</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard
          title="Global Crypto Market Cap"
          value="₹210T"
          icon={Globe}
          color="#6366F1"
          trend="up"
          trendValue="+2.4%"
        />
        <StatCard
          title="24h Volume"
          value="₹8.5T"
          icon={Activity}
          color="#06B6D4"
          trend="up"
          trendValue="+5.1%"
        />
      </div>

      <GlassCard hover={false} style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Top Cryptocurrencies</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Powered by CoinGecko</span>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton" style={{ width: 100, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 80, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 60, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 120, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 100, height: 20 }} /></td>
                  </tr>
                ))
              ) : (
                cryptoData.map((coin) => (
                  <tr key={coin.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={coin.image} alt={coin.name} style={{ width: 24, height: 24 }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{coin.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(coin.current_price)}</td>
                    <td>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4,
                        color: coin.price_change_percentage_24h >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                      }}>
                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </td>
                    <td>{formatCurrency(coin.market_cap)}</td>
                    <td>{formatCurrency(coin.total_volume)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
