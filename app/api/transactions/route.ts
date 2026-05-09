import { NextRequest, NextResponse } from 'next/server';
import { getTransactions } from '@/lib/data';

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get('limit')) || 10;
  try {
    const transactions = await getTransactions(limit);
    return NextResponse.json({ transactions });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}