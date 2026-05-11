export default function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse"
      style={{ height }}
    >
      <div className="h-4 w-32 bg-slate-800 rounded mb-6" />
      <div className="h-full bg-slate-800/50 rounded" />
    </div>
  );
}
