import { Zap, Rss } from 'lucide-react';

const WORKSPACE = {
  name: 'Acme Corp',
  slug: 'acme-corp',
  logo: null,
  brandColor: '#2563EB',
  subscriberCount: 47,
};

const ENTRIES = [
  {
    id: '1',
    title: 'Redesigned dashboard with real-time metrics',
    version: 'v2.4.0',
    date: 'January 15, 2026',
    tags: ['Feature', 'Performance'],
    content: `
## What changed

Complete overhaul of the analytics dashboard. New real-time subscriber charts, improved PR import flow, and faster page loads across the board.

## New features

- Real-time subscriber growth chart updated every 60 seconds
- PR import now shows progress with live updates
- Dashboard loads 3x faster thanks to ISR caching
- New "Quick Actions" panel for common tasks

## Bug fixes

- Fixed an edge case where private repos with special characters failed to sync
- Resolved duplicate email notifications for subscribers with multiple confirmed emails
    `,
  },
  {
    id: '2',
    title: 'Fixed GitHub sync edge case on private repos',
    version: 'v2.3.1',
    date: 'January 10, 2026',
    tags: ['Bug Fix'],
    content: `
## What changed

Resolved an issue where private repos with special characters in the name (hyphens, underscores, dots) failed to sync PRs correctly.

## Root cause

The GitHub API encodes special characters differently depending on the endpoint. Our PR import was using the raw repo name instead of the URL-encoded version.

## Fix

PR import now URL-encodes the repo name before calling the GitHub API. All existing private repos will re-sync automatically on the next import.
    `,
  },
  {
    id: '3',
    title: 'AI generation improvements and cost reduction',
    version: 'v2.3.0',
    date: 'January 5, 2026',
    tags: ['Improvement', 'Performance'],
    content: `
## What changed

Switched the AI backend from GPT-4 to Gemini Flash. Generation is now 3x faster and output quality has improved significantly for technical changelogs.

## Numbers

- Average generation time: 4.2s → 1.1s
- Cost per generation: reduced by 60%
- Output quality score (internal eval): +18%

## What stayed the same

All prompts, the editing experience, and the output format are unchanged. You won't notice any difference except that it's faster.
    `,
  },
];

const TAG_COLORS: Record<string, string> = {
  'Feature': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Bug Fix': 'bg-red-500/10 text-red-500 border-red-500/20',
  'Improvement': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Performance': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  'Breaking Change': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

function ContentRenderer({ content }: { content: string }) {
  const lines = content.trim().split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith('## '))
          return <h3 key={i} className="text-base font-semibold text-gray-900 dark:text-white mt-5 mb-2 first:mt-0">{line.slice(3)}</h3>;
        if (line.startsWith('- '))
          return <li key={i} className="text-sm text-gray-600 dark:text-gray-300 ml-4 list-disc">{line.slice(2)}</li>;
        if (line === '')
          return <div key={i} className="h-1" />;
        return <p key={i} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

export default function PublicChangelogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">

      <header className="border-b border-gray-200 dark:border-zinc-900 bg-white dark:bg-[#111118]">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: WORKSPACE.brandColor }}
            >
              {WORKSPACE.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                {WORKSPACE.name}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Changelog</p>
            </div>
          </div>

          <button
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: WORKSPACE.brandColor }}
          >
            <Rss size={13} />
            Subscribe
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">

        <div className="space-y-12">
          {ENTRIES.map((entry, i) => (
            <article key={entry.id} className="relative">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ring-4 ring-gray-50 dark:ring-[#0a0a0f]"
                    style={{ backgroundColor: WORKSPACE.brandColor }}
                  />
                  {i < ENTRIES.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 dark:bg-zinc-800 mt-2" />
                  )}
                </div>

                <div className="flex-1 pb-10">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{entry.date}</span>
                    {entry.version && (
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-1.5 py-0.5">
                        {entry.version}
                      </span>
                    )}
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        className={`text-[11px] border rounded-full px-2 py-0.5 ${TAG_COLORS[tag] ?? ''}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 leading-snug">
                    {entry.title}
                  </h2>

                  {/* Content */}
                  <div className="prose-sm max-w-none">
                    <ContentRenderer content={entry.content} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-zinc-900 pt-10">
          <div className="bg-white dark:bg-[#111118] border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: `${WORKSPACE.brandColor}15` }}
            >
              <Rss size={18} style={{ color: WORKSPACE.brandColor }} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Stay in the loop
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Get notified when {WORKSPACE.name} ships something new.
              Join {WORKSPACE.subscriberCount} subscribers.
            </p>

            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex-shrink-0"
                style={{ backgroundColor: WORKSPACE.brandColor }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <Zap size={11} />
            Powered by Parallel
          </a>
        </div>
      </main>
    </div>
  );
}