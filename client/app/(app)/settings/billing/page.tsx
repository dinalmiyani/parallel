import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free', price: '$0', period: '/month', current: true,
    features: ['1 repo', '10 entries/month', '5 AI generations', '1 team member', 'Public changelog page'],
    cta: 'Current plan', ctaDisabled: true,
  },
  {
    name: 'Pro', price: '$9', period: '/month', current: false, highlight: true,
    features: ['5 repos', 'Unlimited entries', 'Unlimited AI generations', '3 team members', 'Custom domain', 'Email notifications'],
    cta: 'Upgrade to Pro', ctaDisabled: false,
  },
  {
    name: 'Team', price: '$19', period: '/month', current: false,
    features: ['Unlimited repos', 'Unlimited entries', 'Unlimited AI generations', 'Unlimited team members', 'Custom domain', 'Hide Parallel branding', 'Priority support'],
    cta: 'Upgrade to Team', ctaDisabled: false,
  },
];

const USAGE = [
  { label: 'Changelog entries', used: 8, total: 10, unit: 'entries' },
  { label: 'AI generations', used: 3, total: 5, unit: 'uses' },
  { label: 'Repos connected', used: 2, total: 1, unit: 'repos', over: true },
  { label: 'Team members', used: 1, total: 1, unit: 'members' },
];

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-(--text-primary)">Billing</h2>
        <p className="text-sm text-(--text-muted) mt-0.5">Manage your plan and usage</p>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-(--text-primary)">Current Usage</h3>
          <span className="text-xs text-(--text-muted)">Free plan · Resets Feb 1</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {USAGE.map(({ label, used, total, unit, over }) => {
            const pct = Math.min((used / total) * 100, 100);
            return (
              <div key={label} className="bg-(--bg-overlay) border border-(--border) rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-(--text-muted)">{label}</span>
                  <span className={`text-xs font-medium ${over ? 'text-red-400' : 'text-(--text-secondary)'}`}>
                    {used}/{total} {unit}
                  </span>
                </div>
                <div className="h-1.5 bg-(--bg-base) rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-(--text-primary) mb-3">Choose a plan</h3>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`bg-(--bg-raised) border rounded-xl p-5 space-y-4 relative ${plan.highlight
                  ? 'border-blue-500/40 ring-1 ring-blue-500/20'
                  : 'border-(--border)'
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-semibold text-white bg-blue-600 rounded-full px-3 py-1">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-(--text-primary)">{plan.name}</p>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-2xl font-bold text-(--text-primary)">{plan.price}</span>
                  <span className="text-xs text-(--text-muted)">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-(--text-secondary)">
                    <Check size={12} className="text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.ctaDisabled}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${plan.ctaDisabled
                    ? 'bg-(--bg-overlay) border border-(--border) text-(--text-muted) cursor-not-allowed'
                    : plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-(--bg-overlay) border border-(--border) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--text-muted)'
                  }`}
              >
                {plan.current && <span className="mr-1.5">✓</span>}
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}