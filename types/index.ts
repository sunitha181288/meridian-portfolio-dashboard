export interface Holding {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealisedPnl: number;
  weight: number;
}
export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  ticker: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: 'SETTLED' | 'PENDING';
}