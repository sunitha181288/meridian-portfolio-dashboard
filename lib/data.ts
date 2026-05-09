import clientPromise from '@/lib/mongodb';
import type { Holding, Transaction, PerformancePoint, PortfolioSummary, AllocationItem } from '@/types/index';

const DB = 'meridian';

const SECTOR_COLORS: Record<string, string> = {
  Technology: '#4f7cff',
  Financials: '#3dd68c',
  Healthcare: '#a78bfa',
  Energy: '#f5a623',
  Materials: '#56d3d3',
  'Consumer Staples': '#ff7eb3',
  Industrials: '#ff5e5e',
  Utilities: '#ffe066',
  Cash: '#8899bb',
};

// ── Fetch all holdings ────────────────────────────────────────────────────────
export async function getHoldings(): Promise<Holding[]> {
  const client = await clientPromise;
  const docs = await client
    .db(DB)
    .collection('holdings')
    .find({})
    .toArray();
  return docs.map(d => ({
    ...d,
    _id: d._id.toString(),
  })) as unknown as Holding[];
}

// ── Compute portfolio summary from holdings ───────────────────────────────────
export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const holdings = await getHoldings();

  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);
  const totalCost = holdings.reduce((s, h) => s + h.avgCost * h.quantity, 0);
  const totalUnrealisedPnl = totalValue - totalCost;
  const dayChange = holdings.reduce(
    (s, h) => s + (h.marketValue * h.dayChange) / 100,
    0
  );
  const cashHolding = holdings.find(h => h.assetClass === 'Cash');

  return {
    totalValue,
    totalCost,
    totalUnrealisedPnl,
    totalUnrealisedPnlPct:
      totalCost > 0 ? (totalUnrealisedPnl / totalCost) * 100 : 0,
    dayChange,
    dayChangePct:
      totalValue - dayChange > 0
        ? (dayChange / (totalValue - dayChange)) * 100
        : 0,
    cashBalance: cashHolding?.marketValue ?? 0,
    numberOfPositions: holdings.filter(h => h.assetClass !== 'Cash').length,
  };
}

// ── Get sector allocation for donut chart ────────────────────────────────────
export async function getAllocation(): Promise<AllocationItem[]> {
  const holdings = await getHoldings();
  const total = holdings.reduce((s, h) => s + h.marketValue, 0);

  const bySector = holdings.reduce((acc, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + h.marketValue;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(bySector).map(([name, value]) => ({
    name,
    value,
    percentage: total > 0 ? (value / total) * 100 : 0,
    color: SECTOR_COLORS[name] || '#8899bb',
  }));
}

// ── Get recent transactions ───────────────────────────────────────────────────
export async function getTransactions(limit = 10): Promise<Transaction[]> {
  const client = await clientPromise;
  const docs = await client
    .db(DB)
    .collection('transactions')
    .find({})
    .sort({ date: -1 })
    .limit(limit)
    .toArray();
  return docs.map(d => ({
    ...d,
    _id: d._id.toString(),
  })) as unknown as Transaction[];
}

// ── Get 90-day performance history ───────────────────────────────────────────
export async function getPerformanceHistory(): Promise<PerformancePoint[]> {
  const client = await clientPromise;
  const docs = await client
    .db(DB)
    .collection('performance')
    .find({})
    .sort({ date: 1 })
    .toArray();
  return docs.map(d => ({
    ...d,
    _id: d._id.toString(),
  })) as unknown as PerformancePoint[];
}