import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-3xl font-semibold text-blue-400 tracking-tight mb-2">
          ⬡ Meridian
        </div>
        <div className="text-sm text-slate-500 mb-10">
          A2Z Asset Management
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
          <div className="text-6xl font-semibold text-slate-700 mb-4">404</div>
          <h1 className="text-xl font-semibold text-white mb-2">Page not found</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
