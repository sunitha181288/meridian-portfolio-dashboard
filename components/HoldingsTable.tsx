'use client';
import { useState } from 'react';
import type { Holding } from '@/types/index';
import { formatCurrency, formatPct, pnlColor } from '@/lib/formatters';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = 'name' | 'marketValue' | 'unrealisedPnl' | 'weight' | 'dayChange';

export default function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('marketValue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...holdings].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === 'string') {
      return sortDir === 'asc'
        ? va.localeCompare(vb as string)
        : (vb as string).localeCompare(va);
    }
    return sortDir === 'asc'
      ? (va as number) - (vb as number)
      : (vb as number) - (va as number);
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <th className="text-right px-4 py-3">
      <button
        onClick={() => toggleSort(k)}
        className="flex items-center gap-1 ml-auto text-xs text-slate-500 hover:text-slate-300 uppercase tracking-wider"
      >
        {label}
        {sortKey === k
          ? sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
          : null}
      </button>
    </th>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h3 className="text-sm font-medium text-slate-300">Holdings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">
                Security
              </th>
              <th className="text-right px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">
                Qty
              </th>
              <Th k="marketValue"   label="Market Value" />
              <Th k="unrealisedPnl" label="Unrealised P&L" />
              <Th k="dayChange"     label="Day %" />
              <Th k="weight"        label="Weight" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, i) => (
              <tr
                key={h.id}
                className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                  i % 2 === 0 ? '' : 'bg-slate-800/10'
                }`}
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-slate-800 text-blue-400 px-2 py-0.5 rounded">
                      {h.ticker}
                    </span>
                    <span className="text-slate-300 text-xs truncate max-w-32">{h.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-slate-400 text-xs">
                  {h.quantity.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-slate-200 text-xs font-medium">
                  {formatCurrency(h.marketValue)}
                </td>
                <td className={`px-4 py-3 text-right text-xs font-medium ${pnlColor(h.unrealisedPnl)}`}>
                  {formatCurrency(h.unrealisedPnl, false)}
                  <br />
                  <span className="text-xs opacity-70">{formatPct(h.unrealisedPnlPct)}</span>
                </td>
                <td className={`px-4 py-3 text-right text-xs font-medium ${pnlColor(h.dayChange)}`}>
                  {formatPct(h.dayChange)}
                </td>
                <td className="px-4 py-3 text-right text-slate-400 text-xs">
                  {h.weight.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
