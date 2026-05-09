'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/util';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-(--border) bg-(--bg-base)/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <Zap size={13} className="text-white fill-white" />
          </div>
          <span className="text-(--text-primary) font-semibold text-[15px] tracking-tight">Parallel</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm transition-colors',
                pathname === href
                  ? 'text-(--text-primary) bg-(--bg-overlay)'
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-overlay)'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-3 py-1.5 text-(--text-secondary) hover:text-(--text-primary) text-sm transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}