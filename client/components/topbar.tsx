'use client';

import { Bell, Plus } from 'lucide-react';
import Link from 'next/link';

interface TopbarProps {
  title: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function Topbar({ title, breadcrumb }: TopbarProps) {
  return (
    <header className="h-14 border-b border-(--border) bg-(--bg-raised)/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">

      <div className="flex items-center gap-2 text-sm">
        {breadcrumb ? (
          <>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link href={crumb.href} className="text-(--text-muted) hover:text-(--text-primary) transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-(--text-secondary)">{crumb.label}</span>
                )}
                {i < breadcrumb.length - 1 && (
                  <span className="text-(--text-muted)">/</span>
                )}
              </span>
            ))}
          </>
        ) : (
          <span className="text-(--text-primary) font-semibold text-[15px]">{title}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        <Link
          href="/changelog/new"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium rounded-lg transition-colors"
        >
          <Plus size={13} />
          New Entry
        </Link>
      </div>

    </header>
  );
}