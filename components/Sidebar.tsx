'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { LayoutDashboard, LineChart, List, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard',           label: 'Overview',  icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: LineChart },
  { href: '/dashboard/holdings',  label: 'Holdings',  icon: List },
  { href: '/dashboard/settings',  label: 'Settings',  icon: Settings },
];

export default function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="text-base font-semibold text-blue-400 tracking-tight">
          ⬡ Meridian
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          Antarctica Asset Management
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${active
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user.picture ?? ''}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        
         <a href="/auth/logout"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </a>
      </div>
    </aside>
  );
}