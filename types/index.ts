// ── Holding: one stock/bond/ETF position in the portfolio ─────────────────────
export interface Holding {
  _id?: string;
  id: string;
  name: string;           // e.g. "Apple Inc."
  ticker: string;         // e.g. "AAPL"
  sector: string;         // e.g. "Technology"
  assetClass: string;     // "Equity" | "Fixed Income" | "Cash"
  quantity: number;       // number of shares/units held
  avgCost: number;        // average purchase price per unit
  currentPrice: number;   // current market price per unit
  marketValue: number;    // quantity * currentPrice
  unrealisedPnl: number;  // marketValue - (quantity * avgCost)
  unrealisedPnlPct: number; // unrealisedPnl / (quantity * avgCost) * 100
  weight: number;         // % of total portfolio value
  dayChange: number;      // today's price change %
}

// ── Transaction: a BUY, SELL, or DIVIDEND event ───────────────────────────────
export interface Transaction {
  _id?: string;
  id: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  ticker: string;
  name: string;
  quantity: number;
  price: number;
  total: number;           // quantity * price
  date: string;            // ISO date string
  status: 'SETTLED' | 'PENDING';
}

// ── Performance: one data point in the performance chart ─────────────────────
export interface PerformancePoint {
  date: string;           // "2024-01-01"
  value: number;          // portfolio value in AUD
  benchmark: number;      // ASX 200 benchmark value
}

// ── Portfolio summary: aggregated metrics for the KPI bar ────────────────────
export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalUnrealisedPnl: number;
  totalUnrealisedPnlPct: number;
  dayChange: number;
  dayChangePct: number;
  cashBalance: number;
  numberOfPositions: number;
}

// ── Allocation: sector breakdown for the donut chart ─────────────────────────
export interface AllocationItem {
  name: string;
  value: number;          // market value in AUD
  percentage: number;     // % of total portfolio
  color: string;          // hex color for the chart segment
}
