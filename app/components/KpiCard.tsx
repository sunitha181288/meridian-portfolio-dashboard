import { formatCurrency, formatPct, pnlColor } from '@/lib/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: number;
  type?: 'currency' | 'number' | 'pct';
  showPnl?: boolean;
  subValue?: number;
}

export default function KpiCard({
  label,
  value,
  type = 'currency',
  showPnl = false,
  subValue,
}: KpiCardProps) {
  const displayValue = () => {
    if (type === 'currency') return formatCurrency(value);
    if (type === 'pct') return formatPct(value);
    return value.toLocaleString();
  };

  const colorClass = showPnl ? pnlColor(value) : 'text-white';
  const Icon = value >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {showPnl && <Icon size={14} className={colorClass} />}
      </div>
      <div className={`text-2xl font-semibold tracking-tight ${colorClass}`}>
        {displayValue()}
      </div>
      {subValue !== undefined && (
        <div className={`text-xs mt-1 ${pnlColor(subValue)}`}>
          {formatPct(subValue)}
        </div>
      )}
    </div>
  );
}
