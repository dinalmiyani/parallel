'use client';

import { UsageData } from '@/types/uses-data';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free', price: '$0', current: (plan: string) => plan === 'FREE',
    features: ['1 repo', '10 entries/month', '5 AI uses', '1 member', 'Public changelog'],
    cta: 'Current plan', highlight: false,
  },
  {
    name: 'Pro', price: '$9', current: (plan: string) => plan === 'PRO',
    features: ['5 repos', 'Unlimited entries', 'Unlimited AI', '3 members', 'Custom domain', 'Email notify'],
    cta: 'Upgrade to Pro', highlight: true,
  },
  {
    name: 'Team', price: '$19', current: (plan: string) => plan === 'TEAM',
    features: ['Unlimited repos', 'Unlimited everything', 'Unlimited members', 'Custom domain', 'Remove branding', 'Priority support'],
    cta: 'Upgrade to Team', highlight: false,
  },
];

interface Props {
  usage: UsageData;
}

export default function BillingClient({ usage }: Props) {
  const usageItems = [
    { label: 'Changelog entries', used: usage.usage.entries, limit: usage.limits.maxEntries, unit: 'entries' },
    { label: 'AI generations', used: usage.usage.aiGenerations, limit: usage.limits.maxAiGenerations, unit: 'uses' },
    { label: 'Repos connected', used: usage.usage.projects, limit: usage.limits.maxProjects, unit: 'repos' },
    { label: 'Team members', used: usage.usage.members, limit: usage.limits.maxMembers, unit: 'members' },
  ];

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-base font-semibold text-(--text-primary)">Billing</h2>
        <p className="text-sm text-(--text-muted) mt-0.5">Manage your plan and usage</p>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-(--text-primary)">Current Usage</h3>
          <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5">
            {usage.plan} plan
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {usageItems.map(({ label, used, limit, unit }) => {
            const pct = limit ? Math.min((used / limit) * 100, 100) : 0;
            const over = limit ? used >= limit : false;
            return (
              <div key={label} className="bg-(--bg-overlay) border border-(--border) rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-(--text-muted)">{label}</span>
                  <span className={`text-xs font-medium ${over ? 'text-red-400' : 'text-(--text-secondary)'}`}>
                    {used}/{limit === null ? '∞' : limit} {unit}
                  </span>
                </div>
                {limit !== null && (
                  <div className="h-1.5 bg-(--bg-base) rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-(--text-primary) mb-3">Choose a plan</h3>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.current(usage.plan);
            return (
              <div
                key={plan.name}
                className={`relative bg-(--bg-raised) border rounded-xl p-5 flex flex-col space-y-4 ${plan.highlight && !isCurrent
                    ? 'border-blue-500/40 ring-1 ring-blue-500/20'
                    : 'border-(--border)'
                  }`}
              >
                {plan.highlight && !isCurrent && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-[10px] font-semibold rounded-full px-3 py-0.5">
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-(--text-primary)">{plan.name}</p>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-2xl font-bold text-(--text-primary)">{plan.price}</span>
                    <span className="text-xs text-(--text-muted)">/month</span>
                  </div>
                </div>

                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-(--text-secondary)">
                      <Check size={12} className="text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${isCurrent
                      ? 'bg-(--bg-overlay) border border-(--border) text-(--text-muted) cursor-not-allowed'
                      : plan.highlight
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-(--bg-overlay) border border-(--border) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--text-muted)'
                    }`}
                >
                  {isCurrent ? `✓ Current plan` : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}