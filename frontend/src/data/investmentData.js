const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function createHistory(baseValue, factors) {
  return months.map((month, index) => ({
    month,
    value: Math.round(baseValue * factors[index]),
  }));
}

function createAsset(asset) {
  return {
    ...asset,
    investedAmount: Number(asset.investedAmount),
    currentValue: Number(asset.currentValue),
    quantity: Number(asset.quantity),
    buyPrice: Number(asset.buyPrice),
    currentPrice: Number(asset.currentPrice),
    roi: Number(asset.roi),
    growth: Number(asset.growth),
    history: createHistory(asset.investedAmount, asset.historyFactors),
  };
}

const rawAssets = [
  {
    id: 'bitcoin',
    assetName: 'Bitcoin',
    symbol: 'BTC',
    assetType: 'crypto',
    investedAmount: 756000,
    currentValue: 883500,
    quantity: 0.18,
    buyPrice: 4200000,
    currentPrice: 4919444,
    roi: 16.88,
    riskLevel: 'high',
    sector: 'Digital Assets',
    growth: 4.2,
    description: 'Market-leading digital asset with strong institutional adoption and high volatility.',
    marketCap: '₹96.2T',
    volatility: 'Very High',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 4800000,
    watchlisted: true,
    iconKey: 'bitcoin',
    historyFactors: [0.92, 0.97, 1.02, 1.08, 1.12, 1.17],
  },
  {
    id: 'ethereum',
    assetName: 'Ethereum',
    symbol: 'ETH',
    assetType: 'crypto',
    investedAmount: 525000,
    currentValue: 599250,
    quantity: 2.5,
    buyPrice: 210000,
    currentPrice: 239700,
    roi: 14.14,
    riskLevel: 'high',
    sector: 'Smart Contracts',
    growth: 3.6,
    description: 'Leading smart-contract network powering DeFi, NFTs, and on-chain applications.',
    marketCap: '₹44.8T',
    volatility: 'High',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 245000,
    watchlisted: true,
    iconKey: 'ethereum',
    historyFactors: [0.90, 0.96, 1.00, 1.05, 1.10, 1.14],
  },
  {
    id: 'solana',
    assetName: 'Solana',
    symbol: 'SOL',
    assetType: 'crypto',
    investedAmount: 862500,
    currentValue: 1016000,
    quantity: 75,
    buyPrice: 11500,
    currentPrice: 13547,
    roi: 17.80,
    riskLevel: 'high',
    sector: 'Blockchain Infrastructure',
    growth: 5.4,
    description: 'High-speed blockchain with strong developer activity and expanding ecosystem.',
    marketCap: '₹18.6T',
    volatility: 'Very High',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 14500,
    watchlisted: false,
    iconKey: 'solana',
    historyFactors: [0.89, 0.94, 1.00, 1.06, 1.11, 1.18],
  },
  {
    id: 'apple',
    assetName: 'Apple',
    symbol: 'AAPL',
    assetType: 'stocks',
    investedAmount: 273600,
    currentValue: 331800,
    quantity: 18,
    buyPrice: 15200,
    currentPrice: 18433,
    roi: 21.27,
    riskLevel: 'medium',
    sector: 'Technology',
    growth: 2.1,
    description: 'Blue-chip consumer technology stock with resilient revenue and premium ecosystem.',
    marketCap: '₹317.4T',
    volatility: 'Medium',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 19000,
    watchlisted: true,
    iconKey: 'apple',
    historyFactors: [0.93, 0.97, 1.01, 1.07, 1.11, 1.21],
  },
  {
    id: 'tesla',
    assetName: 'Tesla',
    symbol: 'TSLA',
    assetType: 'stocks',
    investedAmount: 175000,
    currentValue: 207500,
    quantity: 10,
    buyPrice: 17500,
    currentPrice: 20750,
    roi: 18.57,
    riskLevel: 'medium',
    sector: 'EV & Mobility',
    growth: 5.0,
    description: 'High-beta EV manufacturer with strong momentum and a rapid innovation pipeline.',
    marketCap: '₹184.2T',
    volatility: 'High',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 21500,
    watchlisted: false,
    iconKey: 'car',
    historyFactors: [0.91, 0.95, 1.00, 1.05, 1.10, 1.19],
  },
  {
    id: 'nvidia',
    assetName: 'Nvidia',
    symbol: 'NVDA',
    assetType: 'stocks',
    investedAmount: 204000,
    currentValue: 262400,
    quantity: 8,
    buyPrice: 25500,
    currentPrice: 32800,
    roi: 28.63,
    riskLevel: 'medium',
    sector: 'AI Semiconductors',
    growth: 4.8,
    description: 'AI infrastructure leader with strong earnings and a dominant GPU ecosystem.',
    marketCap: '₹286.9T',
    volatility: 'High',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 33500,
    watchlisted: true,
    iconKey: 'chip',
    historyFactors: [0.90, 0.96, 1.02, 1.08, 1.14, 1.28],
  },
  {
    id: 'microsoft',
    assetName: 'Microsoft',
    symbol: 'MSFT',
    assetType: 'stocks',
    investedAmount: 369600,
    currentValue: 431500,
    quantity: 12,
    buyPrice: 30800,
    currentPrice: 35958,
    roi: 16.74,
    riskLevel: 'medium',
    sector: 'Cloud & AI',
    growth: 2.7,
    description: 'Diversified enterprise software and cloud franchise with stable cash flows.',
    marketCap: '₹289.7T',
    volatility: 'Medium',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 36500,
    watchlisted: false,
    iconKey: 'server',
    historyFactors: [0.94, 0.98, 1.00, 1.05, 1.10, 1.17],
  },
  {
    id: 'google',
    assetName: 'Google',
    symbol: 'GOOGL',
    assetType: 'stocks',
    investedAmount: 217800,
    currentValue: 252100,
    quantity: 9,
    buyPrice: 24200,
    currentPrice: 28011,
    roi: 15.75,
    riskLevel: 'medium',
    sector: 'Internet Platforms',
    growth: 2.4,
    description: 'Search and advertising giant with growing cloud and AI monetization upside.',
    marketCap: '₹245.4T',
    volatility: 'Medium',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 28500,
    watchlisted: false,
    iconKey: 'search',
    historyFactors: [0.95, 0.98, 1.01, 1.04, 1.08, 1.16],
  },
  {
    id: 'gold-etf',
    assetName: 'Gold ETF',
    symbol: 'GOLD',
    assetType: 'etf',
    investedAmount: 263250,
    currentValue: 290850,
    quantity: 45,
    buyPrice: 5850,
    currentPrice: 6463,
    roi: 10.48,
    riskLevel: 'low',
    sector: 'Commodities',
    growth: 1.8,
    description: 'Inflation hedge and defensive allocation with lower correlation to equity risk.',
    marketCap: '₹3.8T',
    volatility: 'Low',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 6600,
    watchlisted: true,
    iconKey: 'gold',
    historyFactors: [0.98, 0.99, 1.00, 1.02, 1.05, 1.11],
  },
  {
    id: 'silver-etf',
    assetName: 'Silver ETF',
    symbol: 'SILVER',
    assetType: 'etf',
    investedAmount: 74800,
    currentValue: 82300,
    quantity: 110,
    buyPrice: 68,
    currentPrice: 74.82,
    roi: 10.03,
    riskLevel: 'low',
    sector: 'Commodities',
    growth: 1.4,
    description: 'Precious metal exposure for diversification, inflation protection, and balance.',
    marketCap: '₹1.2T',
    volatility: 'Low',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 78,
    watchlisted: false,
    iconKey: 'silver',
    historyFactors: [0.97, 0.98, 0.99, 1.01, 1.04, 1.10],
  },
  {
    id: 'reliance',
    assetName: 'Reliance',
    symbol: 'RELIANCE',
    assetType: 'stocks',
    investedAmount: 62920,
    currentValue: 70180,
    quantity: 22,
    buyPrice: 2860,
    currentPrice: 3190,
    roi: 11.54,
    riskLevel: 'medium',
    sector: 'Conglomerate',
    growth: 1.6,
    description: 'Diversified Indian blue-chip with energy, telecom, retail, and digital exposure.',
    marketCap: '₹21.7T',
    volatility: 'Medium',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 3250,
    watchlisted: false,
    iconKey: 'building',
    historyFactors: [0.94, 0.97, 1.00, 1.03, 1.06, 1.12],
  },
  {
    id: 'tcs',
    assetName: 'TCS',
    symbol: 'TCS',
    assetType: 'stocks',
    investedAmount: 56800,
    currentValue: 67340,
    quantity: 16,
    buyPrice: 3550,
    currentPrice: 4208,
    roi: 18.55,
    riskLevel: 'low',
    sector: 'IT Services',
    growth: 1.9,
    description: 'Large-cap IT services leader with stable margins and strong enterprise relationships.',
    marketCap: '₹14.9T',
    volatility: 'Low',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 4300,
    watchlisted: true,
    iconKey: 'computer',
    historyFactors: [0.95, 0.98, 1.01, 1.04, 1.08, 1.18],
  },
  {
    id: 'hdfc-bank',
    assetName: 'HDFC Bank',
    symbol: 'HDFCBANK',
    assetType: 'stocks',
    investedAmount: 44400,
    currentValue: 50900,
    quantity: 30,
    buyPrice: 1480,
    currentPrice: 1697,
    roi: 14.64,
    riskLevel: 'low',
    sector: 'Banking',
    growth: 1.5,
    description: 'Private-sector banking heavyweight with broad retail franchise and stable credit quality.',
    marketCap: '₹11.4T',
    volatility: 'Low',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 1725,
    watchlisted: false,
    iconKey: 'bank',
    historyFactors: [0.96, 0.99, 1.01, 1.03, 1.06, 1.15],
  },
  {
    id: 'sbi',
    assetName: 'SBI',
    symbol: 'SBIN',
    assetType: 'stocks',
    investedAmount: 39050,
    currentValue: 47950,
    quantity: 55,
    buyPrice: 710,
    currentPrice: 872,
    roi: 22.79,
    riskLevel: 'medium',
    sector: 'Banking',
    growth: 2.9,
    description: 'Public-sector banking exposure with improving asset quality and operating leverage.',
    marketCap: '₹7.8T',
    volatility: 'Medium',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 890,
    watchlisted: false,
    iconKey: 'bank',
    historyFactors: [0.93, 0.96, 0.99, 1.03, 1.08, 1.23],
  },
  {
    id: 'mutual-fund',
    assetName: 'Nifty 50 Mutual Fund',
    symbol: 'NIFTY50MF',
    assetType: 'mutual_funds',
    investedAmount: 28440,
    currentValue: 31900,
    quantity: 240,
    buyPrice: 118.5,
    currentPrice: 132.92,
    roi: 12.17,
    riskLevel: 'low',
    sector: 'Diversified Equity',
    growth: 1.2,
    description: 'Broad-market mutual fund for disciplined long-term wealth creation and diversification.',
    marketCap: '₹1.1T',
    volatility: 'Low',
    lastUpdated: '2026-05-28T09:30:00Z',
    targetPrice: 135,
    watchlisted: true,
    iconKey: 'fund',
    historyFactors: [0.97, 0.99, 1.00, 1.02, 1.05, 1.12],
  },
];

export const portfolioAssets = rawAssets.map(createAsset);

export const trendingAssets = portfolioAssets
  .filter((asset) => ['bitcoin', 'ethereum', 'apple', 'tesla', 'gold-etf'].includes(asset.id))
  .map((asset) => ({
    ...asset,
    dailyGrowth: asset.growth,
  }));

export const initialWatchlist = portfolioAssets.filter((asset) => asset.watchlisted).map((asset) => asset.id);

export function getAssetTypeLabel(type) {
  const labels = {
    stocks: 'Stocks',
    crypto: 'Crypto',
    etf: 'ETF',
    mutual_funds: 'Mutual Funds',
    commodities: 'Commodities',
  };

  return labels[type] || type;
}

export function calculatePortfolioSummary(assets) {
  const totalInvestment = assets.reduce((sum, asset) => sum + asset.investedAmount, 0);
  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalProfitLoss = totalCurrentValue - totalInvestment;
  const roi = totalInvestment ? (totalProfitLoss / totalInvestment) * 100 : 0;

  const assetTypes = assets.reduce((accumulator, asset) => {
    const key = asset.assetType;
    if (!accumulator[key]) {
      accumulator[key] = { invested: 0, current: 0, count: 0 };
    }
    accumulator[key].invested += asset.investedAmount;
    accumulator[key].current += asset.currentValue;
    accumulator[key].count += 1;
    return accumulator;
  }, {});

  const assetAllocation = Object.entries(assetTypes).map(([type, value]) => ({
    type,
    name: getAssetTypeLabel(type),
    invested: value.invested,
    current: value.current,
    percentage: totalCurrentValue ? (value.current / totalCurrentValue) * 100 : 0,
  }));

  const riskWeights = { low: 26, medium: 58, high: 84 };
  const weightedRisk = assets.reduce((sum, asset) => {
    const weight = asset.investedAmount / (totalInvestment || 1);
    return sum + (riskWeights[asset.riskLevel] || 50) * weight;
  }, 0);

  const cryptoWeight = assetTypes.crypto ? (assetTypes.crypto.current / (totalCurrentValue || 1)) * 100 : 0;
  const highRiskShare = totalCurrentValue
    ? assets.filter((asset) => asset.riskLevel === 'high').reduce((sum, asset) => sum + asset.currentValue, 0) / totalCurrentValue * 100
    : 0;
  const riskScore = Math.max(0, Math.min(100, Math.round(weightedRisk + cryptoWeight * 0.12 + highRiskShare * 0.08)));

  const riskLevel = riskScore < 35 ? 'low' : riskScore < 65 ? 'medium' : 'high';

  const riskDistribution = ['low', 'medium', 'high'].map((level) => ({
    name: level,
    value: assets.filter((asset) => asset.riskLevel === level).length,
    amount: assets.filter((asset) => asset.riskLevel === level).reduce((sum, asset) => sum + asset.currentValue, 0),
  }));

  const monthlyPerformance = months.map((month, index) => ({
    month,
    investment: assets.reduce((sum, asset) => sum + ((asset.history[index]?.value || asset.investedAmount) * 0.92), 0),
    value: assets.reduce((sum, asset) => sum + (asset.history[index]?.value || asset.currentValue), 0),
  }));

  const profitLossByAsset = assets
    .map((asset) => ({
      name: asset.symbol,
      profitLoss: asset.currentValue - asset.investedAmount,
      roi: asset.roi,
    }))
    .sort((a, b) => b.profitLoss - a.profitLoss);

  return {
    totalInvestment,
    totalCurrentValue,
    totalProfitLoss,
    roi,
    assetAllocation,
    riskScore,
    riskLevel,
    riskDistribution,
    monthlyPerformance,
    profitLossByAsset,
    cryptoWeight,
    highRiskShare,
  };
}

export function buildInitialTransactions(assets) {
  return assets.slice(0, 8).map((asset, index) => ({
    id: `${asset.id}-tx-${index + 1}`,
    asset_name: asset.assetName,
    symbol: asset.symbol,
    action: index % 3 === 0 ? 'buy' : index % 5 === 0 ? 'sell' : 'buy',
    amount: Math.round(asset.currentValue * 0.18),
    created_at: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
  }));
}

export function buildInitialNotifications(assets) {
  const summary = calculatePortfolioSummary(assets);
  return [
    {
      id: 'notif-1',
      title: 'Investment Added Successfully',
      message: 'Your portfolio is ready with premium dummy investment data.',
      type: 'success',
      unread: true,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: 'notif-2',
      title: 'Tesla moved up',
      message: 'Tesla gained 5% today and is trending above the monthly average.',
      type: 'success',
      unread: true,
      createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      id: 'notif-3',
      title: 'Portfolio Risk Alert',
      message: `Portfolio risk is now ${summary.riskLevel === 'high' ? 'High' : summary.riskLevel === 'medium' ? 'Medium' : 'Low'} with a score of ${summary.riskScore}/100.`,
      type: summary.riskLevel,
      unread: false,
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 'notif-4',
      title: 'Bitcoin target crossed',
      message: 'Bitcoin crossed your target price and is continuing to build momentum.',
      type: 'warning',
      unread: true,
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
  ];
}

export function generateSmartAdvice(assets) {
  const summary = calculatePortfolioSummary(assets);
  const techAssets = assets.filter((asset) => ['Technology', 'Cloud & AI', 'AI Semiconductors', 'Internet Platforms'].includes(asset.sector));
  const lowRiskAssets = assets.filter((asset) => asset.riskLevel === 'low');

  return [
    {
      id: 'advice-1',
      risk_level: summary.riskLevel,
      message: summary.cryptoWeight > 30
        ? 'Diversify your crypto exposure by moving part of the allocation into low-risk ETFs or mutual funds.'
        : 'Your current allocation is balanced. Keep monitoring high-beta assets for sudden swings.',
    },
    {
      id: 'advice-2',
      risk_level: lowRiskAssets.length >= 4 ? 'low' : 'medium',
      message: lowRiskAssets.length >= 4
        ? 'You already have a strong base of low-risk holdings. Continue adding quality defensive instruments.'
        : 'Consider adding low-risk ETFs or debt-style assets to improve stability and reduce drawdowns.',
    },
    {
      id: 'advice-3',
      risk_level: techAssets.length >= 4 ? 'medium' : 'low',
      message: techAssets.length >= 4
        ? 'Your portfolio is heavily concentrated in tech stocks. Rebalance toward commodities or diversified funds.'
        : 'A little more diversification across sectors can smooth the portfolio growth curve.',
    },
    {
      id: 'advice-4',
      risk_level: summary.roi >= 15 ? 'low' : 'medium',
      message: summary.roi >= 15
        ? 'Your portfolio is performing well. Consider booking partial profits on assets with the strongest gains.'
        : 'Use dollar-cost averaging on assets with negative ROI to improve long-term cost basis.',
    },
  ];
}

export function getTopTrendingAssets(assets) {
  return [...assets]
    .sort((a, b) => (b.growth + b.roi) - (a.growth + a.roi))
    .slice(0, 5)
    .map((asset) => ({
      ...asset,
      dailyGrowth: asset.growth,
    }));
}
