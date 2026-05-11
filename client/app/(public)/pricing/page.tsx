import Link from 'next/link';
import { Check, X, ArrowRight, Zap } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Perfect for solo developers just getting started.',
    cta: 'Get started free',
    ctaHref: '/sign-up',
    highlight: false,
    features: [
      { text: '1 GitHub repo', included: true },
      { text: '10 changelog entries/month', included: true },
      { text: '5 AI generations/month', included: true },
      { text: '1 team member', included: true },
      { text: 'Public changelog page', included: true },
      { text: 'Email notifications', included: false },
      { text: 'Custom domain', included: false },
      { text: 'Remove Parallel branding', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    desc: 'For indie hackers and small teams that ship regularly.',
    cta: 'Start Pro trial',
    ctaHref: '/sign-up',
    highlight: true,
    features: [
      { text: '5 GitHub repos', included: true },
      { text: 'Unlimited entries', included: true },
      { text: 'Unlimited AI generations', included: true },
      { text: '3 team members', included: true },
      { text: 'Public changelog page', included: true },
      { text: 'Email notifications', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Remove Parallel branding', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    name: 'Team',
    price: '$19',
    desc: 'For growing teams that need everything unlocked.',
    cta: 'Start Team trial',
    ctaHref: '/sign-up',
    highlight: false,
    features: [
      { text: 'Unlimited repos', included: true },
      { text: 'Unlimited entries', included: true },
      { text: 'Unlimited AI generations', included: true },
      { text: 'Unlimited team members', included: true },
      { text: 'Public changelog page', included: true },
      { text: 'Email notifications', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Remove Parallel branding', included: true },
      { text: 'Priority support', included: true },
    ],
  },
];

const FAQS = [
  { q: 'Do I need a credit card to start?', a: 'No. The free plan is forever free and requires no payment information.' },
  { q: 'Can I connect private GitHub repos?', a: 'Yes. GitHub OAuth gives Parallel read access to your private repos. We only read PR titles and descriptions — never your code.' },
  { q: 'What AI model does Parallel use?', a: 'We use Google Gemini Flash — it\'s fast, accurate, and cost-efficient. This lets us offer unlimited AI generations on paid plans.' },
  { q: 'Can I export my changelogs?', a: 'Yes. You can export all entries as JSON or Markdown from the Settings page anytime.' },
  { q: 'What happens when I hit the free plan limit?', a: 'You\'ll see a prompt to upgrade. Existing published entries stay visible — you just can\'t create new ones until you upgrade or the month resets.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No lock-in. Cancel from Settings at any time. Your data stays accessible for 30 days after cancellation.' },
];

export default function PricingPage() {
  return (
    <div className="bg-(--bg-base)">

      <section className="pt-28 pb-14 text-center px-6">
        <p className="text-blue-400 text-sm font-medium mb-3">Pricing</p>
        <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) tracking-tight mb-4">
          Simple, transparent pricing.
        </h1>
        <p className="text-(--text-muted) max-w-md mx-auto">
          Start free. Upgrade when you need more. No surprise charges.
        </p>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative bg-(--bg-raised) border rounded-2xl p-6 flex flex-col ${plan.highlight
                  ? 'border-blue-500/40 ring-1 ring-blue-500/20'
                  : 'border-(--border)'
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-[11px] font-semibold rounded-full px-3 py-1">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-semibold text-(--text-primary) mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-(--text-primary)">{plan.price}</span>
                  <span className="text-sm text-(--text-muted)">/month</span>
                </div>
                <p className="text-xs text-(--text-muted) leading-relaxed">{plan.desc}</p>
              </div>

              <Link
                href={plan.ctaHref}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold mb-6 transition-colors ${plan.highlight
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary)'
                  }`}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </Link>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map(({ text, included }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm">
                    {included
                      ? <Check size={14} className="text-emerald-400 flex-shrink-0" />
                      : <X size={14} className="text-(--text-muted) flex-shrink-0 opacity-40" />
                    }
                    <span className={included ? 'text-(--text-secondary)' : 'text-(--text-muted) opacity-50'}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 border-t border-(--border) bg-(--bg-raised)">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-(--text-primary) text-center mb-10 tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-5">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="border-b border-(--border) pb-5 last:border-0">
                <h3 className="text-sm font-semibold text-(--text-primary) mb-2">{q}</h3>
                <p className="text-sm text-(--text-muted) leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Ready to start?</h2>
        <p className="text-(--text-muted) mb-8 text-sm">Free forever. No credit card. Takes 5 minutes.</p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
        >
          <Zap size={15} />
          Get started free
        </Link>
      </section>

    </div>
  );
}