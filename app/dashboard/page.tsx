import { Suspense } from 'react';
import {
  getPortfolioSummary,
  getHoldings,
  getAllocation,
  getTransactions,
  getPerformanceHistory,
} from '@/lib/data';
import KpiCard from '../components/KpiCard';
import PerformanceChart from '../components/PerformanceChart';
import AllocationDonut from '../components/AllocationDonut';
import HoldingsTable from '../components/HoldingsTable';
import ActivityFeed from '../components/ActivityFeed';
import ChartSkeleton from '../components/ChartSkeleton';

export default async function DashboardPage() {
  const [summary, holdings, allocation, transactions, performance] = await Promise.all([
    getPortfolioSummary(),
    getHoldings(),
    getAllocation(),
    getTransactions(8),
    getPerformanceHistory(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Portfolio Overview
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Antarctica Asset Management · Meridian Fund
        </p>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total AUM"      value={summary.totalValue}         type="currency" />
        <KpiCard label="Unrealised P&L" value={summary.totalUnrealisedPnl} type="currency" showPnl />
        <KpiCard label="Today's Change" value={summary.dayChange}          type="currency" showPnl />
        <KpiCard label="Positions"      value={summary.numberOfPositions}  type="number" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <PerformanceChart data={performance} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<ChartSkeleton height={280} />}>
            <AllocationDonut data={allocation} />
          </Suspense>
        </div>
      </div>

      {/* Holdings + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HoldingsTable holdings={holdings} />
        </div>
        <div>
          <ActivityFeed transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
