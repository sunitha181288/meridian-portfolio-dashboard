import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const HOLDINGS = [
  { id:'h1',  name:'BHP Group',         ticker:'BHP',  sector:'Materials',        assetClass:'Equity', quantity:1200, avgCost:38.50,  currentPrice:44.20,  dayChange:0.8  },
  { id:'h2',  name:'Commonwealth Bank',  ticker:'CBA',  sector:'Financials',       assetClass:'Equity', quantity:800,  avgCost:92.00,  currentPrice:108.50, dayChange:-0.3 },
  { id:'h3',  name:'CSL Limited',        ticker:'CSL',  sector:'Healthcare',       assetClass:'Equity', quantity:250,  avgCost:285.00, currentPrice:292.40, dayChange:1.2  },
  { id:'h4',  name:'Afterpay',           ticker:'APT',  sector:'Technology',       assetClass:'Equity', quantity:500,  avgCost:62.00,  currentPrice:71.80,  dayChange:2.1  },
  { id:'h5',  name:'Woodside Energy',    ticker:'WDS',  sector:'Energy',           assetClass:'Equity', quantity:900,  avgCost:28.50,  currentPrice:26.10,  dayChange:-1.5 },
  { id:'h6',  name:'Telstra Group',      ticker:'TLS',  sector:'Consumer Staples', assetClass:'Equity', quantity:3000, avgCost:3.80,   currentPrice:4.05,   dayChange:0.5  },
  { id:'h7',  name:'Macquarie Group',    ticker:'MQG',  sector:'Financials',       assetClass:'Equity', quantity:180,  avgCost:175.00, currentPrice:188.20, dayChange:0.4  },
  { id:'h8',  name:'Fortescue Metals',   ticker:'FMG',  sector:'Materials',        assetClass:'Equity', quantity:650,  avgCost:18.20,  currentPrice:21.70,  dayChange:-0.8 },
  { id:'h9',  name:'AGL Energy',         ticker:'AGL',  sector:'Utilities',        assetClass:'Equity', quantity:2200, avgCost:8.10,   currentPrice:9.45,   dayChange:1.0  },
  { id:'h10', name:'Cash (AUD)',          ticker:'CASH', sector:'Cash',             assetClass:'Cash',   quantity:1,    avgCost:85000,  currentPrice:85000,  dayChange:0    },
];

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI!, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: false,
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('meridian');

    // Clear existing data
    await Promise.all([
      db.collection('holdings').deleteMany({}),
      db.collection('transactions').deleteMany({}),
      db.collection('performance').deleteMany({}),
    ]);

    // Compute derived fields and insert holdings
    const holdings = HOLDINGS.map(h => ({
      ...h,
      marketValue: h.quantity * h.currentPrice,
      unrealisedPnl: h.quantity * (h.currentPrice - h.avgCost),
      unrealisedPnlPct: ((h.currentPrice - h.avgCost) / h.avgCost) * 100,
      weight: 0,
    }));
    const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);
    holdings.forEach(h => h.weight = (h.marketValue / totalValue) * 100);
    await db.collection('holdings').insertMany(holdings);
    console.log('✅ Holdings inserted');

    // Generate 50 random transactions
    const tickers = HOLDINGS.filter(h => h.assetClass !== 'Cash').map(h => h.ticker);
    const types: ('BUY' | 'SELL' | 'DIVIDEND')[] = ['BUY', 'BUY', 'BUY', 'SELL', 'DIVIDEND'];
    const txns = Array.from({ length: 50 }, (_, i) => {
      const ticker = tickers[Math.floor(Math.random() * tickers.length)];
      const holding = HOLDINGS.find(h => h.ticker === ticker)!;
      const type = types[Math.floor(Math.random() * types.length)];
      const qty = type === 'DIVIDEND' ? 0 : Math.floor(Math.random() * 100 + 10);
      const price = holding.currentPrice * (0.97 + Math.random() * 0.06);
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return {
        id: `t${i + 1}`,
        type,
        ticker,
        name: holding.name,
        quantity: qty,
        price: Math.round(price * 100) / 100,
        total: type === 'DIVIDEND'
          ? Math.round(holding.quantity * 0.85 * 100) / 100
          : Math.round(qty * price * 100) / 100,
        date: date.toISOString(),
        status: Math.random() > 0.1 ? 'SETTLED' : 'PENDING',
      };
    });
    await db.collection('transactions').insertMany(txns);
    console.log('✅ Transactions inserted');

    // Generate 90-day performance history
    let portfolioVal = totalValue * 0.88;
    let benchmarkVal = totalValue * 0.88;
    const perf = Array.from({ length: 90 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (90 - i));
      portfolioVal *= (1 + (Math.random() * 0.014 - 0.005));
      benchmarkVal *= (1 + (Math.random() * 0.012 - 0.005));
      return {
        date: d.toISOString().split('T')[0],
        value: Math.round(portfolioVal),
        benchmark: Math.round(benchmarkVal),
      };
    });
    await db.collection('performance').insertMany(perf);
    console.log('✅ Performance history inserted');

    console.log('\n✅ Seed complete! 10 holdings, 50 transactions, 90-day history inserted.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await client.close();
  }
}

seed();