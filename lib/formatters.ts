// Format a number as AUD currency: 1250000 → "A$1.25M"
export function formatCurrency(value: number, compact = true): string {
  if (compact && Math.abs(value) >= 1_000_000) {
    return `A$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `A$${(value / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value);
}

// Format a percentage with sign: 2.5 → "+2.50%", -1.3 → "-1.30%"
export function formatPct(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Return Tailwind class for P&L colour: positive=green, negative=red
export function pnlColor(value: number): string {
  if (value > 0) return 'text-emerald-400';
  if (value < 0) return 'text-red-400';
  return 'text-slate-400';
}

// Format ISO date string to human-readable: "2024-03-15" → "15 Mar 2024"
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format date as "Mar 15" for chart x-axis labels
export function formatChartDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    month: 'short',
    day: 'numeric',
  });
}
