import type { Transaction } from '@/types/index';
import { formatCurrency, formatDate } from '@/lib/formatters';

const TYPE_STYLE: Record<string, string> = {
  BUY:      'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  SELL:     'bg-red-500/10 text-red-400 border border-red-500/20',
  DIVIDEND: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

export default function ActivityFeed({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-sm font-medium text-slate-300 mb-4">Recent activity</h3>
      <div className="space-y-3">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className="flex items-start gap-3 py-2 border-b border-slate-800/50 last:border-0"
          >
            <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded mt-0.5 flex-shrink-0 ${TYPE_STYLE[tx.type]}`}>
              {tx.type}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-blue-400">{tx.ticker}</span>
                <span className="text-xs font-medium text-slate-200">
                  {tx.type === 'DIVIDEND' ? '+' : ''}{formatCurrency(tx.total)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-slate-500">{formatDate(tx.date)}</span>
                <span className={`text-xs ${tx.status === 'SETTLED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {tx.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
