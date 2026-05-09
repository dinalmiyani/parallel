'use client';

import { SignIn } from '@clerk/nextjs';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-(--bg-base) flex">

      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="text-(--text-primary) font-semibold text-lg tracking-tight">Parallel</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-xs font-medium">AI-Powered Changelogs</span>
            </div>
            <h1 className="text-4xl font-bold text-(--text-primary) leading-tight tracking-tight">
              Ship faster.
              <br />
              <span className="text-blue-400">Document better.</span>
            </h1>
            <p className="text-(--text-secondary) leading-relaxed max-w-sm">
              Connect GitHub. Let AI write your release notes. Publish in one click.
            </p>
          </div>

          <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-(--text-secondary) text-xs">Latest release</span>
              </div>
              <span className="text-(--text-muted) text-xs font-mono">v2.4.0</span>
            </div>
            <p className="text-(--text-primary) text-sm font-medium mb-2">
              Redesigned dashboard with real-time metrics
            </p>
            <p className="text-(--text-muted) text-xs leading-relaxed">
              Performance improvements across all pages. New analytics widgets.
            </p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5">Feature</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">Performance</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          {[
            { value: '2,400+', label: 'Developers' },
            { value: '18,000+', label: 'Changelogs published' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-(--text-primary) font-semibold text-lg">{stat.value}</p>
              <p className="text-(--text-muted) text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="text-(--text-primary) font-semibold text-lg tracking-tight">Parallel</span>
          </Link>
        </div>
        <SignIn />
      </div>

    </div>
  );
}