import Link from 'next/link';

export default function LoggedOutPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Logo */}
        <div className="text-3xl font-semibold text-blue-400 tracking-tight mb-2">
          ⬡ Meridian
        </div>
        <div className="text-sm text-slate-500 mb-10">
          A2Z Asset Management
        </div>

        {/* Message */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">
            You have been signed out
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your session has ended securely. Sign back in to access the Meridian portfolio dashboard.
          </p>
        </div>

        {/* Sign in button */}
        <Link
          href="/auth/login"
          className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Sign in again
        </Link>
        <p className="text-xs text-slate-600 mt-6">
          A2Z Asset Management · Meridian Fund · Confidential
        </p>
      </div>
    </div>
  );
}