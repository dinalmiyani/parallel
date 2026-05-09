'use client';

import { SignUp } from '@clerk/nextjs';
import { Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const BENEFITS = [
  'Connect any GitHub repo in 30 seconds',
  'AI writes your changelog from merged PRs',
  'Public changelog page — instantly live',
  'Email subscribers on every release',
];

export default function SignUpPage() {
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
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="text-(--text-primary) font-semibold text-lg tracking-tight">Parallel</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <p className="text-blue-400 text-sm font-medium">Start for free</p>
            <h1 className="text-4xl font-bold text-(--text-primary) leading-tight tracking-tight">
              Your changelog,
              <br />
              <span className="text-blue-400">on autopilot.</span>
            </h1>
            <p className="text-(--text-secondary) leading-relaxed max-w-sm">
              Stop writing release notes manually. Let AI do it from your GitHub PRs.
            </p>
          </div>

          <ul className="space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />
                <span className="text-(--text-secondary) text-sm">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {['GitHub PRs', 'AI Summary', 'Published'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <div className="bg-(--bg-raised) border border-(--border) rounded-lg px-3 py-2">
                  <span className="text-(--text-secondary) text-xs font-medium">{step}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-(--text-muted) text-sm">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-(--text-muted) text-xs">
            No credit card required. Free plan includes 1 repo and 10 entries/month.
          </p>
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
        <SignUp />
      </div>

    </div>
  );
}