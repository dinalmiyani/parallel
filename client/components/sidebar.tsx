'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { LayoutDashboard, GitBranch, ScrollText, BarChart2, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/util';
import ThemeToggle from './theme-toggle';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: GitBranch, label: 'Projects', href: '/projects' },
  { icon: ScrollText, label: 'Changelog', href: '/changelog' },
  { icon: BarChart2, label: 'Analytics', href: '/analytics' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-(--bg-raised) border-r border-(--border) flex flex-col z-40">

      <div className="h-14 flex items-center px-4 border-b border-(--border) flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <Zap size={11} className="text-white fill-white" />
          </div>
          <span className="text-(--text-primary) font-semibold text-[14px] tracking-tight">Parallel</span>
        </Link>
      </div>

      <div className="px-3 py-3 border-b border-(--border) flex-shrink-0 space-y-2">
        <OrganizationSwitcher
          hidePersonal
          afterSelectOrganizationUrl="/dashboard"
          afterCreateOrganizationUrl="/dashboard"
        />
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
                active
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay)'
              )}
            >
              <Icon size={15} className={active ? 'text-blue-400' : 'text-(--text-muted)'} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-(--border) space-y-0.5 flex-shrink-0">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
            pathname.startsWith('/settings')
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
              : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay)'
          )}
        >
          <Settings size={15} className={pathname.startsWith('/settings') ? 'text-blue-400' : 'text-(--text-muted)'} />
          Settings
        </Link>

        <div className="flex items-center gap-2.5 px-3 py-2">
          <UserButton />
          <span className="text-(--text-muted) text-[13px]">Account</span>
        </div>
      </div>

    </aside>
  );
}