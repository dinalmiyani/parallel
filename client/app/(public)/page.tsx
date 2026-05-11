import Link from 'next/link';
import {
  Zap, GitPullRequest, ScrollText, Users, ArrowRight,
  Check, Star, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: GitPullRequest,
    title: 'GitHub Sync',
    desc: 'Connect any repo. Merged PRs are imported automatically — public or private.',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'AI Summaries',
    desc: 'Gemini reads your commits and PR descriptions. Writes like a human, not a robot.',
    color: 'blue',
  },
  {
    icon: ScrollText,
    title: 'Public Page',
    desc: 'Every workspace gets a public changelog at your-brand.parallel.is-a.dev.',
    color: 'violet',
  },
  {
    icon: Users,
    title: 'Email Notify',
    desc: 'Subscribers get a beautiful email the moment you publish a new release.',
    color: 'amber',
  },
];

const FEATURE_COLORS: Record<string, { bg: string; icon: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', ring: 'ring-blue-500/20' },
  violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', ring: 'ring-violet-500/20' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', ring: 'ring-amber-500/20' },
};

const STEPS = [
  { step: '01', title: 'Connect GitHub', desc: 'Authorize Parallel and select your repo. Takes 30 seconds.' },
  { step: '02', title: 'Import PRs', desc: 'Parallel fetches your merged pull requests automatically.' },
  { step: '03', title: 'Generate', desc: 'Select PRs and click Generate. AI writes the entry.' },
  { step: '04', title: 'Publish', desc: 'Review, edit if needed, hit Publish. Subscribers notified.' },
];

const TESTIMONIALS = [
  {
    quote: "We were writing changelogs manually in Notion. Parallel cut that to zero. Our users actually know what changed now.",
    name: 'Rohan Mehta',
    role: 'CTO at BuildFast',
    avatar: 'RM',
  },
  {
    quote: "The AI output is surprisingly good. I barely edit anything. Ship on Friday, changelog is live by the time I close my laptop.",
    name: 'Sara Chen',
    role: 'Indie hacker',
    avatar: 'SC',
  },
  {
    quote: "Our subscribers went from 0 to 200 in a month just because we started communicating what we ship. This tool made that effortless.",
    name: 'James O.',
    role: 'Founder at Layerstack',
    avatar: 'JO',
  },
];

const PREVIEW_ENTRIES = [
  { version: 'v2.4.0', title: 'Redesigned dashboard', tag: 'Feature', tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20', date: '2d ago' },
  { version: 'v2.3.1', title: 'Fixed GitHub sync bug', tag: 'Bug Fix', tagColor: 'text-red-400 bg-red-500/10 border-red-500/20', date: '1w ago' },
  { version: 'v2.3.0', title: 'AI speed improvements', tag: 'Performance', tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', date: '2w ago' },
];

export default function HomePage() {
  return (
    <div className="bg-(--bg-base)">

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-xs font-medium">AI-Powered Changelog Tool</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-(--text-primary) leading-[1.05] tracking-tight mb-6">
            Ship faster.
            <br />
            <span className="text-blue-400">Document better.</span>
          </h1>

          <p className="text-lg text-(--text-secondary) max-w-xl mx-auto leading-relaxed mb-10">
            Connect GitHub. Let AI turn your merged PRs into beautiful changelogs.
            Publish in one click. Keep your users in the loop.
          </p>

          <div className="flex items-center justify-center gap-3 mb-16">
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/25"
            >
              Get started free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/acme-corp/changelog"
              className="flex items-center gap-2 px-6 py-3 bg-(--bg-raised) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary) font-medium rounded-xl transition-all"
            >
              See live demo
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="relative bg-(--bg-raised) border border-(--border) rounded-2xl overflow-hidden shadow-2xl shadow-black/20 max-w-2xl mx-auto">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-(--border) bg-(--bg-overlay)">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-xs text-(--text-muted) font-mono">parallel.is-a.dev/dashboard</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-32 bg-(--bg-overlay) rounded animate-pulse" />
                <div className="h-7 w-24 bg-blue-600/20 border border-blue-500/20 rounded-lg" />
              </div>
              {PREVIEW_ENTRIES.map(entry => (
                <div key={entry.version} className="flex items-center gap-3 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="font-mono text-[10px] text-(--text-muted) bg-(--bg-base) border border-(--border) rounded px-1.5 py-0.5">{entry.version}</span>
                  <span className={`text-[10px] border rounded-full px-2 py-0.5 ${entry.tagColor}`}>{entry.tag}</span>
                  <span className="text-xs text-(--text-primary) font-medium flex-1">{entry.title}</span>
                  <span className="text-[11px] text-(--text-muted)">{entry.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-(--border) bg-(--bg-raised) py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-12 flex-wrap">
          {[
            { value: '2,400+', label: 'Developers' },
            { value: '18,000+', label: 'Changelogs published' },
            { value: '97,000+', label: 'Subscribers notified' },
            { value: '99.9%', label: 'Uptime' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-(--text-primary)">{stat.value}</p>
              <p className="text-xs text-(--text-muted) mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-400 text-sm font-medium mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary) tracking-tight">
              Everything you need.
              <br />Nothing you don't.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => {
              const c = FEATURE_COLORS[color];
              return (
                <div key={title} className="bg-(--bg-raised) border border-(--border) rounded-2xl p-6 hover:border-(--text-muted) transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center mb-4`}>
                    <Icon size={18} className={c.icon} />
                  </div>
                  <h3 className="font-semibold text-(--text-primary) mb-2">{title}</h3>
                  <p className="text-sm text-(--text-muted) leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-(--bg-raised) border-y border-(--border)">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-400 text-sm font-medium mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary) tracking-tight">
              From merged PR to published changelog
              <br />in under 2 minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-5 bg-(--bg-base) border border-(--border) rounded-2xl">
                <span className="text-3xl font-bold text-(--border) font-mono flex-shrink-0 leading-none mt-1">
                  {step}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-(--text-primary) mb-1">{title}</h3>
                  <p className="text-sm text-(--text-muted) leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-400 text-sm font-medium mb-3">Testimonials</p>
            <h2 className="text-3xl font-bold text-(--text-primary) tracking-tight">
              Loved by developers who ship.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ quote, name, role, avatar }) => (
              <div key={name} className="bg-(--bg-raised) border border-(--border) rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-(--text-secondary) leading-relaxed flex-1">"{quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-(--border)">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-(--text-primary)">{name}</p>
                    <p className="text-[11px] text-(--text-muted)">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-(--bg-raised) border-y border-(--border)">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-blue-400 text-sm font-medium mb-3">Pricing</p>
          <h2 className="text-3xl font-bold text-(--text-primary) tracking-tight mb-4">
            Start free. Upgrade when you need to.
          </h2>
          <p className="text-(--text-muted) mb-8">No credit card required. Free plan forever.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { name: 'Free', price: '$0', features: ['1 repo', '10 entries/mo', '5 AI uses'] },
              { name: 'Pro', price: '$9', features: ['5 repos', 'Unlimited entries', 'Unlimited AI'], highlight: true },
              { name: 'Team', price: '$19', features: ['Unlimited repos', 'Unlimited everything', 'Custom domain'] },
            ].map(plan => (
              <div
                key={plan.name}
                className={`bg-(--bg-base) border rounded-2xl p-5 text-left ${plan.highlight ? 'border-blue-500/40 ring-1 ring-blue-500/20' : 'border-(--border)'
                  }`}
              >
                <p className="text-sm font-semibold text-(--text-primary) mb-1">{plan.name}</p>
                <p className="text-2xl font-bold text-(--text-primary) mb-4">
                  {plan.price}<span className="text-sm font-normal text-(--text-muted)">/mo</span>
                </p>
                <ul className="space-y-1.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-(--text-secondary)">
                      <Check size={11} className="text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link
            href="/pricing"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
          >
            See full pricing details <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-(--bg-raised) border border-(--border) rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/3 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-(--text-primary) mb-4 tracking-tight">
                Start shipping better changelogs today.
              </h2>
              <p className="text-(--text-muted) mb-8">
                Free forever. No credit card. Setup in under 5 minutes.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/25"
              >
                Get started free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-(--border) py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <Zap size={11} className="text-white fill-white" />
              </div>
              <span className="text-sm font-semibold text-(--text-primary)">Parallel</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-(--text-muted)">
              <Link href="/pricing" className="hover:text-(--text-primary) transition-colors">Pricing</Link>
              <Link href="/about" className="hover:text-(--text-primary) transition-colors">About</Link>
              <Link href="/blog" className="hover:text-(--text-primary) transition-colors">Blog</Link>
              <Link href="/privacy" className="hover:text-(--text-primary) transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-(--text-primary) transition-colors">Terms</Link>
            </div>

            <div className="flex items-center gap-3">
              <a href="https://github.com" className="w-8 h-8 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-raised) transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a href="https://twitter.com" className="w-8 h-8 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-raised) transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-(--border) text-center">
            <p className="text-xs text-(--text-muted)">
              © 2026 Parallel. Built with ❤️ by a solo developer.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}