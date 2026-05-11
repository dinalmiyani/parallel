import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const STACK = [
  { name: 'Next.js 15', desc: 'App Router, SSR, ISR, Server Actions' },
  { name: 'NestJS', desc: 'Backend API and webhook handling' },
  { name: 'Clerk', desc: 'Auth and organization management' },
  { name: 'Prisma', desc: 'Type-safe database ORM' },
  { name: 'Supabase', desc: 'PostgreSQL database' },
  { name: 'Gemini Flash', desc: 'AI changelog generation' },
  { name: 'Resend', desc: 'Transactional email' },
  { name: 'Tailwind CSS', desc: 'Styling and dark/light mode' },
];

const TIMELINE = [
  { date: 'Jan 2026', event: 'Parallel launches publicly. First 50 signups in 24 hours.' },
  { date: 'Dec 2025', event: 'Beta testing with 10 indie hackers. Core flow working end-to-end.' },
  { date: 'Nov 2025', event: 'Started building. Identified the changelog problem personally.' },
];

export default function AboutPage() {
  return (
    <div className="bg-(--bg-base)">

      <section className="pt-28 pb-16 px-6 text-center">
        <p className="text-blue-400 text-sm font-medium mb-3">About</p>
        <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) tracking-tight mb-6">
          Built by a developer,
          <br />for developers.
        </h1>
        <p className="text-(--text-muted) max-w-lg mx-auto leading-relaxed">
          Parallel started as a personal frustration. I kept shipping features and forgetting
          to tell users about them. Changelogs felt like homework. So I automated it.
        </p>
      </section>

      <section className="py-16 border-y border-(--border) bg-(--bg-raised)">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h2 className="text-xl font-bold text-(--text-primary)">The problem</h2>
          <p className="text-sm text-(--text-muted) leading-relaxed">
            I was running a small SaaS and shipping 3–4 features every week. The problem?
            My users had no idea. They'd ask for features I'd already built. They'd cancel
            because they thought the product wasn't evolving.
          </p>
          <p className="text-sm text-(--text-muted) leading-relaxed">
            Every tool I tried required me to write changelogs manually. I'd open Notion,
            try to remember what I shipped, write something vague, copy-paste it somewhere.
            It took 30–45 minutes and I skipped it more often than not.
          </p>
          <p className="text-sm text-(--text-muted) leading-relaxed">
            Then I realized — everything I ship goes through GitHub PRs. The information
            is already there. I just needed something to read it and write the changelog for me.
            That's Parallel.
          </p>

          <h2 className="text-xl font-bold text-(--text-primary) pt-4">The solution</h2>
          <p className="text-sm text-(--text-muted) leading-relaxed">
            Parallel connects to your GitHub repo, reads your merged pull requests, and uses
            AI to generate clean, human-readable changelog entries. You review, edit if needed,
            and publish. Your users get an email. The whole thing takes under 2 minutes.
          </p>
          <p className="text-sm text-(--text-muted) leading-relaxed">
            No more changelog debt. No more users asking "what changed?" Your changelog
            stays up to date automatically, and your users stay in the loop.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-(--text-primary) mb-8">Who built this</h2>

          <div className="bg-(--bg-raised) border border-(--border) rounded-2xl p-6 flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-400 flex-shrink-0">
              A
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-(--text-primary) mb-0.5">Ajay</h3>
              <p className="text-xs text-(--text-muted) mb-3">Full-stack developer · Ahmedabad, India</p>
              <p className="text-sm text-(--text-muted) leading-relaxed mb-4">
                2.5 years building with React and Next.js. Parallel is my portfolio project and
                my attempt to solve a real problem I had. I built it to learn, to ship, and to
                hopefully make other developers' lives a little easier.
              </p>
              <div className="flex items-center gap-3">
                // Footer social links — replace the icon components with inline SVGs
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
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-(--border) bg-(--bg-raised)">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-xl font-bold text-(--text-primary) mb-2">Tech stack</h2>
          <p className="text-sm text-(--text-muted) mb-8">Everything used to build Parallel.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STACK.map(({ name, desc }) => (
              <div key={name} className="flex items-start gap-3 px-4 py-3 bg-(--bg-base) border border-(--border) rounded-xl">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-(--text-primary)">{name}</p>
                  <p className="text-xs text-(--text-muted)">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-(--text-primary) mb-8">Timeline</h2>
          <div className="space-y-6">
            {TIMELINE.map(({ date, event }) => (
              <div key={date} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <div className="w-px flex-1 bg-(--border) mt-2" />
                </div>
                <div className="pb-6">
                  <p className="text-xs font-mono text-blue-400 mb-1">{date}</p>
                  <p className="text-sm text-(--text-secondary)">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center border-t border-(--border)">
        <h2 className="text-2xl font-bold text-(--text-primary) mb-4">Try it yourself</h2>
        <p className="text-(--text-muted) mb-8 text-sm max-w-sm mx-auto">
          Free forever. No credit card. Your first changelog in under 5 minutes.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
        >
          Get started free <ArrowRight size={15} />
        </Link>
      </section>

    </div>
  );
}