'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Topbar from '@/components/topbar';
import { Settings, Palette, Users, CreditCard, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/util';

const SETTINGS_NAV = [
  { icon: Settings, label: 'General', href: '/settings/general' },
  { icon: Palette, label: 'Branding', href: '/settings/branding' },
  { icon: Users, label: 'Team', href: '/settings/team' },
  { icon: CreditCard, label: 'Billing', href: '/settings/billing' },
  { icon: AlertTriangle, label: 'Danger Zone', href: '/settings/danger', danger: true },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Settings" />

      <div className="flex flex-1 px-6 py-6 gap-6 max-w-[1100px]">

        <aside className="w-[200px] flex-shrink-0">
          <nav className="space-y-0.5">
            {SETTINGS_NAV.map(({ icon: Icon, label, href, danger }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                      : danger
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-raised)'
                  )}
                >
                  <Icon size={14} className={active ? 'text-blue-400' : danger ? 'text-red-400' : 'text-(--text-muted)'} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          {children}
        </div>

      </div>
    </div>
  );
}