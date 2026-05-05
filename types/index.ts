export interface Holding {
  fundId: string
  fundName: string
  fundType: string
  category: string
  units: number
  currentValue: number
  costBasis: number
  returnPct: number
  allocationPct: number
}

export interface PortfolioDocument {
  _id?: string
  userId: string          
  totalValue: number
  totalCost: number
  currency: 'HKD' | 'USD' | 'GBP'
  holdings: Holding[]
  lastUpdated: Date
}

export interface Transaction {
  _id?: string
  userId: string
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'INTEREST'
  fundId: string
  fundName: string
  amount: number         
  units?: number
  pricePerUnit?: number
  date: Date
  notes?: string
}

export interface PerformanceDataPoint {
  month: string           
  portfolioValue: number
  benchmarkValue: number
}

export interface PortfolioStats {
  totalValue: number
  totalCost: number
  unrealisedPnL: number
  unrealisedPnLPct: number
  ytdReturn: number
  sharpeRatio: number
  volatility: number
  maxDrawdown: number
  beta: number
  currency: string
}
