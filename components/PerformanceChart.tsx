'use client';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { PerformancePoint } from '@/types/index';
import { formatCurrency, formatChartDate } from '@/lib/formatters';

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  const thinned = data.filter((_, i) => i % 15 === 0 || i === data.length - 1);
  const labelSet = new Set(thinned.map(d => d.date));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-sm font-medium text-slate-300 mb-6">90-day performance</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#475569', fontSize: 11 }}
            tickLine={false}
            tickFormatter={d => labelSet.has(d) ? formatChartDate(d) : ''}
            interval={0}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => formatCurrency(v)}
            width={72}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Line
            type="monotone" dataKey="value" name="Meridian"
            stroke="#4f7cff" strokeWidth={2} dot={false} activeDot={{ r: 4 }}
          />
          <Line
            type="monotone" dataKey="benchmark" name="ASX 200"
            stroke="#475569" strokeWidth={1.5} strokeDasharray="5 3" dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
