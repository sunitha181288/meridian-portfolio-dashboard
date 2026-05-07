/**
 * scripts/seed.ts
 *
 * Populates MongoDB with demo data so the dashboard works
 * without needing real investor data.
 *
 * Run with: npm run seed
 */

import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const DEMO_USER_ID = 'demo|sunitha'

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  const db = client.db('meridian')

  console.log('🌱 Seeding MongoDB...')

  // Drop existing demo data
  await db.collection('portfolios').deleteMany({ userId: DEMO_USER_ID })
  await db.collection('transactions').deleteMany({ userId: DEMO_USER_ID })
  await db.collection('performance_history').deleteMany({})

  // ── PORTFOLIO ──────────────────────────────────────────────
  await db.collection('portfolios').insertOne({
    userId: DEMO_USER_ID,
    totalValue: 2843000,
    totalCost: 2525000,
    currency: 'USD',
    lastUpdated: new Date(),
    holdings: [
      {
        fundId: 'fund_001',
        fundName: 'Global Equity Growth',
        fundType: 'Equity',
        category: 'Developed Markets',
        units: 854,
        currentValue: 854000,
        costBasis: 722000,
        returnPct: 18.2,
        allocationPct: 30.1,
      },
      {
        fundId: 'fund_002',
        fundName: 'Asia Pacific Bond',
        fundType: 'Fixed Income',
        category: 'APAC',
        units: 625,
        currentValue: 625000,
        costBasis: 587000,
        returnPct: 6.4,
        allocationPct: 22.0,
      },
      {
        fundId: 'fund_003',
        fundName: 'HK Technology Fund',
        fundType: 'Equity',
        category: 'Sector',
        units: 512,
        currentValue: 512000,
        costBasis: 419000,
        returnPct: 22.1,
        allocationPct: 18.0,
      },
      {
        fundId: 'fund_004',
        fundName: 'Real Assets REIT',
        fundType: 'Alternatives',
        category: 'Real Estate',
        units: 398,
        currentValue: 398000,
        costBasis: 407000,
        returnPct: -2.3,
        allocationPct: 14.0,
      },
      {
        fundId: 'fund_005',
        fundName: 'USD Money Market',
        fundType: 'Cash Equivalent',
        category: 'Cash',
        units: 284,
        currentValue: 284000,
        costBasis: 271000,
        returnPct: 4.8,
        allocationPct: 10.0,
      },
      {
        fundId: 'fund_006',
        fundName: 'EM Opportunities',
        fundType: 'Equity',
        category: 'Emerging Markets',
        units: 170,
        currentValue: 170000,
        costBasis: 155000,
        returnPct: 9.7,
        allocationPct: 6.0,
      },
    ],
  })

  // ── TRANSACTIONS ───────────────────────────────────────────
  const transactions = [
    {
      userId: DEMO_USER_ID,
      type: 'BUY',
      fundId: 'fund_001',
      fundName: 'Global Equity Growth',
      amount: 50000,
      units: 42,
      pricePerUnit: 1190,
      date: new Date('2026-04-21'),
      notes: 'Monthly top-up',
    },
    {
      userId: DEMO_USER_ID,
      type: 'DIVIDEND',
      fundId: 'fund_002',
      fundName: 'Asia Pacific Bond',
      amount: 3240,
      date: new Date('2026-04-18'),
      notes: 'Q1 dividend reinvested',
    },
    {
      userId: DEMO_USER_ID,
      type: 'SELL',
      fundId: 'fund_004',
      fundName: 'Real Assets REIT',
      amount: -25000,
      units: -61,
      pricePerUnit: 409,
      date: new Date('2026-04-15'),
      notes: 'Partial exit — rebalancing',
    },
    {
      userId: DEMO_USER_ID,
      type: 'BUY',
      fundId: 'fund_003',
      fundName: 'HK Technology Fund',
      amount: 80000,
      units: 102,
      pricePerUnit: 784,
      date: new Date('2026-04-10'),
      notes: 'New position opened',
    },
    {
      userId: DEMO_USER_ID,
      type: 'INTEREST',
      fundId: 'fund_005',
      fundName: 'USD Money Market',
      amount: 1130,
      date: new Date('2026-04-01'),
      notes: 'Monthly interest',
    },
    {
      userId: DEMO_USER_ID,
      type: 'BUY',
      fundId: 'fund_006',
      fundName: 'EM Opportunities',
      amount: 30000,
      units: 193,
      pricePerUnit: 155,
      date: new Date('2026-03-20'),
      notes: 'Added to existing position',
    },
  ]

  await db.collection('transactions').insertMany(transactions)

  // ── PERFORMANCE HISTORY ────────────────────────────────────
  const perfHistory = [
    { userId: DEMO_USER_ID, month: 'Nov 2025', portfolioValue: 2420000, benchmarkValue: 2400000 },
    { userId: DEMO_USER_ID, month: 'Dec 2025', portfolioValue: 2510000, benchmarkValue: 2460000 },
    { userId: DEMO_USER_ID, month: 'Jan 2026', portfolioValue: 2600000, benchmarkValue: 2520000 },
    { userId: DEMO_USER_ID, month: 'Feb 2026', portfolioValue: 2690000, benchmarkValue: 2580000 },
    { userId: DEMO_USER_ID, month: 'Mar 2026', portfolioValue: 2760000, benchmarkValue: 2640000 },
    { userId: DEMO_USER_ID, month: 'Apr 2026', portfolioValue: 2843000, benchmarkValue: 2700000 },
  ]

  await db.collection('performance_history').insertMany(perfHistory)

  // ── INDEXES ────────────────────────────────────────────────
  // Compound index for efficient transaction queries
  await db.collection('transactions').createIndex(
    { userId: 1, date: -1 },
    { name: 'userId_date_desc' }
  )
  await db.collection('portfolios').createIndex(
    { userId: 1 },
    { unique: true, name: 'userId_unique' }
  )

  console.log('✅ Seed complete!')
  console.log('   - 1 portfolio document')
  console.log('   - 6 transactions')
  console.log('   - 6 performance history points')
  console.log('   - 2 indexes created')

  await client.close()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
