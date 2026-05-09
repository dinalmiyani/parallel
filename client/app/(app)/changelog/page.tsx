"use client";

import Topbar from '@/components/topbar';
import Link from 'next/link';
import {
  Plus, Search, Filter, GitPullRequest,
  Clock, Eye, EyeOff, MoreHorizontal,
  Zap, ScrollText,
} from 'lucide-react';

const ENTRIES = [
  {
    id: '1', title: 'Redesigned dashboard with real-time metrics',
    version: 'v2.4.0', status: 'published', project: 'my-saas-app',
    date: 'Jan 15, 2026', tags: ['Feature', 'Performance'], prs: 4,
    excerpt: 'Complete overhaul of the analytics dashboard. New real-time subscriber charts, improved PR import flow, and faster page loads across the board.',
  },
  {
    id: '2', title: 'Fixed GitHub sync edge case on private repos',
    version: 'v2.3.1', status: 'published', project: 'my-saas-app',
    date: 'Jan 10, 2026', tags: ['Bug Fix'], prs: 1,
    excerpt: 'Resolved an issue where private repos with special characters in the name failed to sync PRs correctly.',
  },
  {
    id: '3', title: 'AI generation improvements and cost reduction',
    version: 'v2.3.0', status: 'published', project: 'api-service',
    date: 'Jan 5, 2026', tags: ['Improvement', 'Performance'], prs: 3,
    excerpt: 'Switched to Gemini Flash model. 3x faster generation, 60% cost reduction per entry. Output quality improved significantly.',
  },
  {
    id: '4', title: 'New subscriber email template',
    version: null, status: 'draft', project: 'my-saas-app',
    date: '2 hours ago', tags: ['Feature'], prs: 2,
    excerpt: 'Redesigned the notification email sent to subscribers when a new changelog entry is published.',
  },
  {
    id: '5', title: 'Breaking: API response shape updated',
    version: 'v3.0.0', status: 'draft', project: 'api-service',
    date: '1 hour ago', tags: ['Breaking Change'], prs: 6,
    excerpt: 'Major version bump. All API responses now use a consistent envelope format with data, meta, and error fields.',
  },
  {
    id: '6', title: 'Added keyboard shortcuts for power users',
    version: 'v2.2.0', status: 'published', project: 'my-saas-app',
    date: 'Dec 28, 2025', tags: ['Feature'], prs: 2,
    excerpt: 'Cmd+S to save draft, Cmd+Enter to publish, Cmd+K for quick navigation. Full shortcut reference in settings.',
  },
];

const TAG_COLORS: Record<string, string> = {
  'Feature': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Bug Fix': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Improvement': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Performance': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Breaking Change': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Security': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const FILTERS = ['All', 'Published', 'Draft', 'Feature', 'Bug Fix', 'Improvement'];

export default function ChangelogPage() {
  const published = ENTRIES.filter(e => e.status === 'published').length;
  const drafts = ENTRIES.filter(e => e.status === 'draft').length;

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Changelog" />

      <div className="flex-1 px-6 py-6 max-w-[1100px] space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-(--text-primary) tracking-tight">Changelog</h1>
            <p className="text-(--text-muted) text-sm mt-0.5">
              {published} published · {drafts} drafts
            </p>
          </div>
          <Link
            href="/changelog/new"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={14} />
            New Entry
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              placeholder="Search entries..."
              className="w-full pl-8 pr-4 py-2 bg-(--bg-raised) border border-(--border) rounded-lg text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {FILTERS.map((f, i) => (
              <button
                key={f}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${i === 0
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                    : 'bg-(--bg-raised) text-(--text-muted) border-(--border) hover:text-(--text-primary) hover:border-(--text-muted)'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 bg-(--bg-raised) border border-(--border) hover:border-(--text-muted) text-(--text-muted) hover:text-(--text-primary) text-xs rounded-lg transition-colors">
            <Filter size={12} />
            Newest first
          </button>
        </div>

        <div className="space-y-2">
          {ENTRIES.map((entry) => (
            <Link
              key={entry.id}
              href={`/changelog/${entry.id}`}
              className="group flex gap-4 p-4 bg-(--bg-raised) border border-(--border) rounded-xl hover:border-(--text-muted) transition-all"
            >
              <div className="flex flex-col items-center pt-1 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full mt-0.5 ${entry.status === 'published' ? 'bg-emerald-400' : 'bg-(--text-muted)'
                  }`} />
                <div className="w-px flex-1 bg-(--border) mt-2 min-h-[20px]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {entry.version && (
                      <span className="font-mono text-[11px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded px-1.5 py-0.5">
                        {entry.version}
                      </span>
                    )}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${entry.status === 'published'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-(--text-muted) bg-(--bg-overlay) border-(--border)'
                      }`}>
                      {entry.status}
                    </span>
                    {entry.tags.map(tag => (
                      <span key={tag} className={`text-[10px] border rounded-full px-2 py-0.5 ${TAG_COLORS[tag] ?? ''}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={e => e.preventDefault()}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
                      title={entry.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {entry.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      onClick={e => e.preventDefault()}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
                    >
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-(--text-primary) leading-snug mb-1.5 group-hover:text-blue-400 transition-colors">
                  {entry.title}
                </h3>

                <p className="text-xs text-(--text-muted) leading-relaxed line-clamp-2 mb-2.5">
                  {entry.excerpt}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-(--text-muted)">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {entry.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitPullRequest size={10} />
                    {entry.prs} PR{entry.prs !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <ScrollText size={10} />
                    {entry.project}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {ENTRIES.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-(--bg-raised) border border-(--border) flex items-center justify-center mb-4">
              <ScrollText size={20} className="text-(--text-muted)" />
            </div>
            <h3 className="text-(--text-primary) font-semibold mb-1">No entries yet</h3>
            <p className="text-(--text-muted) text-sm mb-4 max-w-xs">
              Connect a GitHub repo and generate your first changelog from merged PRs.
            </p>
            <Link
              href="/changelog/new"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Zap size={13} />
              Generate from PRs
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}