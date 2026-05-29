import { createSlice } from '@reduxjs/toolkit';
import {
  buildInitialNotifications,
  calculatePortfolioSummary,
  generateSmartAdvice,
} from '../data/investmentData';

function roundAmount(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function mapAssetToHolding(asset, quantity = 1) {
  const currentPrice = Number(asset.currentPrice ?? asset.current_price ?? asset.buyPrice ?? asset.buy_price ?? 0);
  const buyPrice = Number(asset.buyPrice ?? asset.buy_price ?? currentPrice);
  const holdingQuantity = Number(quantity);
  const investedAmount = roundAmount(holdingQuantity * buyPrice);
  const currentValue = roundAmount(holdingQuantity * currentPrice);

  return {
    id: asset.id || asset.symbol || asset.assetName,
    assetName: asset.assetName || asset.asset_name,
    symbol: asset.symbol || asset.ticker_symbol,
    assetType: asset.assetType || asset.asset_type || 'stocks',
    investedAmount,
    currentValue,
    quantity: holdingQuantity,
    buyPrice,
    currentPrice,
    roi: investedAmount ? roundAmount(((currentValue - investedAmount) / investedAmount) * 100) : 0,
    riskLevel: asset.riskLevel || asset.risk_level || 'medium',
    sector: asset.sector || 'Diversified',
    growth: Number(asset.growth ?? 0),
    description: asset.description || '',
    marketCap: asset.marketCap || '₹0',
    volatility: asset.volatility || 'Medium',
    lastUpdated: new Date().toISOString(),
    targetPrice: Number(asset.targetPrice ?? currentPrice),
    watchlisted: !!asset.watchlisted,
    iconKey: asset.iconKey || 'circle-dollar-sign',
    history: asset.history || [],
  };
}

function createNotification(title, message, type = 'info') {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    message,
    type,
    unread: true,
    createdAt: new Date().toISOString(),
  };
}

function mapBackendAsset(asset) {
  const quantity = Number(asset.quantity || 0);
  const buyPrice = Number(asset.buy_price || 0);
  const currentPrice = Number(asset.current_price || 0);
  const investedAmount = roundAmount(quantity * buyPrice);
  const currentValue = roundAmount(quantity * currentPrice);

  return {
    id: asset.id,
    assetName: asset.asset_name,
    symbol: asset.ticker_symbol || asset.symbol,
    assetType: asset.asset_type,
    investedAmount,
    currentValue,
    quantity,
    buyPrice,
    currentPrice,
    roi: Number(asset.roi || 0),
    riskLevel: asset.risk_level || 'medium',
    sector: asset.sector || 'Diversified',
    growth: Number(asset.growth || 0),
    description: asset.description || '',
    marketCap: asset.market_cap || '₹0',
    volatility: asset.volatility || 'Medium',
    lastUpdated: asset.last_updated || new Date().toISOString(),
    targetPrice: Number(asset.target_price || currentPrice),
    watchlisted: !!asset.watchlisted,
    iconKey: asset.icon_key || 'circle-dollar-sign',
    history: asset.history || [],
    status: asset.status || (quantity > 0 ? 'held' : 'available'),
  };
}

const createInitialState = () => ({
  assets: [],
  transactions: [],
  notifications: [],
  watchlist: [],
});

const initialState = createInitialState();

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    resetPortfolio: () => createInitialState(),
    hydratePortfolioData: (state, action) => {
      const { assets = [], transactions = [], notifications = [], watchlist = [] } = action.payload || {};
      state.assets = assets.map(mapBackendAsset);
      state.transactions = transactions;
      state.notifications = notifications;
      state.watchlist = watchlist;
    },
    addInvestment: (state, action) => {
      const incoming = action.payload || {};
      const quantity = Number(incoming.quantity || 1);
      const existing = state.assets.find((asset) => asset.id === incoming.id || asset.symbol === incoming.symbol);

      if (existing) {
        const purchasePrice = Number(incoming.currentPrice ?? incoming.buyPrice ?? existing.currentPrice);
        const newQuantity = roundAmount(existing.quantity + quantity);
        const newInvestedAmount = roundAmount(existing.investedAmount + purchasePrice * quantity);
        const newCurrentValue = roundAmount(newQuantity * purchasePrice);

        existing.quantity = newQuantity;
        existing.investedAmount = newInvestedAmount;
        existing.buyPrice = newQuantity ? roundAmount(newInvestedAmount / newQuantity) : existing.buyPrice;
        existing.currentPrice = purchasePrice;
        existing.currentValue = newCurrentValue;
        existing.roi = newInvestedAmount ? roundAmount(((newCurrentValue - newInvestedAmount) / newInvestedAmount) * 100) : 0;
        existing.growth = Number(incoming.growth ?? existing.growth);
        existing.lastUpdated = new Date().toISOString();
        existing.watchlisted = incoming.watchlisted ?? existing.watchlisted;
      } else {
        state.assets.unshift(mapAssetToHolding(incoming, quantity));
      }

      const symbol = incoming.symbol || incoming.ticker_symbol || incoming.assetName || 'Asset';
      const amount = roundAmount(quantity * Number(incoming.currentPrice ?? incoming.buyPrice ?? incoming.current_price ?? incoming.buy_price ?? 0));

      state.transactions.unshift({
        id: `${symbol}-${Date.now()}`,
        asset_name: incoming.assetName || incoming.asset_name || symbol,
        symbol,
        action: 'buy',
        amount,
        created_at: new Date().toISOString(),
      });

      state.notifications.unshift(createNotification(
        'Investment Added Successfully',
        `${incoming.assetName || incoming.asset_name || symbol} has been added to your portfolio.`,
        'success'
      ));

      const summary = calculatePortfolioSummary(state.assets);
      if (summary.cryptoWeight > 30) {
        state.notifications.unshift(createNotification(
          'Crypto exposure is high',
          'Your crypto allocation is above the recommended comfort zone. Consider rebalancing into ETFs or large-cap stocks.',
          'warning'
        ));
      }
      if (summary.riskScore >= 65) {
        state.notifications.unshift(createNotification(
          'Portfolio risk increased',
          `Portfolio risk increased to ${summary.riskLevel === 'high' ? 'High' : 'Medium'}.`,
          'danger'
        ));
      }
    },
    removeInvestment: (state, action) => {
      const assetId = action.payload;
      const asset = state.assets.find((entry) => entry.id === assetId);
      if (!asset) return;

      state.assets = state.assets.filter((entry) => entry.id !== assetId);
      state.watchlist = state.watchlist.filter((id) => id !== assetId);
      state.transactions.unshift({
        id: `${asset.symbol}-sell-${Date.now()}`,
        asset_name: asset.assetName,
        symbol: asset.symbol,
        action: 'sell',
        amount: asset.currentValue,
        created_at: new Date().toISOString(),
      });
      state.notifications.unshift(createNotification(
        'Investment Removed',
        `${asset.assetName} has been removed from your portfolio.`,
        'info'
      ));
    },
    toggleWatchlist: (state, action) => {
      const assetId = action.payload;
      if (state.watchlist.includes(assetId)) {
        state.watchlist = state.watchlist.filter((id) => id !== assetId);
      } else {
        state.watchlist.unshift(assetId);
      }
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find((entry) => entry.id === action.payload);
      if (notification) notification.unread = false;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.unread = false;
      });
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
    refreshInsights: (state) => {
      state.notifications = buildInitialNotifications(state.assets);
    },
  },
});

export const {
  resetPortfolio,
  hydratePortfolioData,
  addInvestment,
  removeInvestment,
  toggleWatchlist,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  refreshInsights,
} = portfolioSlice.actions;

export const selectPortfolioAssets = (state) => state.portfolio.assets;
export const selectPortfolioTransactions = (state) => state.portfolio.transactions;
export const selectPortfolioNotifications = (state) => state.portfolio.notifications;
export const selectWatchlist = (state) => state.portfolio.watchlist;

export const selectPortfolioSummary = (state) => calculatePortfolioSummary(state.portfolio.assets);
export const selectSmartAdvice = (state) => generateSmartAdvice(state.portfolio.assets);

export default portfolioSlice.reducer;
