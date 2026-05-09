import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioSummary, getHoldings, getAllocation } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const [summary, holdings, allocation] = await Promise.all([
      getPortfolioSummary(),
      getHoldings(),
      getAllocation(),
    ]);
    return NextResponse.json({ summary, holdings, allocation });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}