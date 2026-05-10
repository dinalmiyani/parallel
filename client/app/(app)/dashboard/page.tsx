import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Topbar from '@/components/topbar';
import {
  ScrollText, GitPullRequest, Users, TrendingUp,
  ExternalLink, Clock, Zap, ChevronRight, GitBranch,
} from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { label: 'Total Entries', value: '24', delta: '+3 this month', icon: ScrollText, color: 'blue' },
  { label: 'Published', value: '18', delta: '6 drafts', icon: TrendingUp, color: 'emerald' },
  { label: 'PRs Available', value: '12', delta: 'ready to use', icon: GitPullRequest, color: 'amber' },
  { label: 'Subscribers', value: '47', delta: '+8 this week', icon: Users, color: 'violet' },
];

const RECENT_ENTRIES = [
  { id: '1', title: 'Redesigned dashboard with real-time metrics', version: 'v2.4.0', status: 'published', date: '2 days ago', tags: ['Feature', 'Performance'] },
  { id: '2', title: 'Fixed GitHub sync edge case on private repos', version: 'v2.3.1', status: 'published', date: '5 days ago', tags: ['Bug Fix'] },
  { id: '3', title: 'AI generation improvements and cost reduction', version: 'v2.3.0', status: 'published', date: '1 week ago', tags: ['Improvement'] },
  { id: '4', title: 'New subscriber email template', version: null, status: 'draft', date: '2 hours ago', tags: ['Feature'] },
  { id: '5', title: 'Breaking: API response shape updated', version: 'v3.0.0', status: 'draft', date: '1 hour ago', tags: ['Breaking Change'] },
];

const RECENT_PRS = [
  { number: 247, title: 'feat: add webhook retry logic', merged: '3h ago' },
  { number: 246, title: 'fix: subscriber duplicate emails', merged: '1d ago' },
  { number: 245, title: 'chore: upgrade prisma to v5.10', merged: '2d ago' },
];

const STAT_COLORS: Record<string, { bg: string; icon: string; ring: string }> = {
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', ring: 'ring-1 ring-blue-500/20' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-1 ring-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', ring: 'ring-1 ring-amber-500/20' },
  violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', ring: 'ring-1 ring-violet-500/20' },
};

const TAG_COLORS: Record<string, string> = {
  'Feature': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Bug Fix': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Improvement': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Performance': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Breaking Change': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Dashboard" />

      <div className="flex-1 px-6 py-6 space-y-6 max-w-[1200px]">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-(--text-primary) tracking-tight">
              Good morning 👋
            </h1>
            <p className="text-(--text-muted) text-sm mt-0.5">
              Here's what's happening with your changelog.
            </p>
          </div>
          <a
            href="/acme-corp/changelog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary) text-xs font-medium rounded-lg transition-all"
          >
            <ExternalLink size={11} />
            View public page
          </a>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map(({ label, value, delta, icon: Icon, color }) => {
            const c = STAT_COLORS[color];
            return (
              <div
                key={label}
                className="bg-(--bg-raised) border border-(--border) rounded-xl p-4 hover:border-(--text-muted) transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-(--text-muted) text-xs font-medium">{label}</p>
                  <div className={`w-7 h-7 rounded-lg ${c.bg} ${c.ring} flex items-center justify-center`}>
                    <Icon size={13} className={c.icon} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-(--text-primary) tracking-tight">{value}</p>
                <p className="text-(--text-muted) text-xs mt-1">{delta}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 bg-(--bg-raised) border border-(--border) rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
              <h2 className="text-sm font-semibold text-(--text-primary)">Recent Entries</h2>
              <Link href="/changelog" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-0.5">
                View all <ChevronRight size={11} />
              </Link>
            </div>

            <div className="divide-y divide-(--border)">
              {RECENT_ENTRIES.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-(--bg-overlay) transition-colors cursor-pointer"
                >
                  <div className="mt-1.5 flex-shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${entry.status === 'published' ? 'bg-emerald-400' : 'bg-(--text-muted)'
                      }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.version && (
                        <span className="font-mono text-[10px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded px-1.5 py-0.5">
                          {entry.version}
                        </span>
                      )}
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${entry.status === 'published'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-(--text-muted) bg-(--bg-overlay) border-(--border)'
                        }`}>
                        {entry.status}
                      </span>
                    </div>

                    <p className="text-(--text-primary) text-sm font-medium leading-snug truncate">
                      {entry.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] border rounded-full px-2 py-0.5 ${TAG_COLORS[tag] ?? 'text-(--text-secondary) bg-(--bg-overlay) border-(--border)'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-(--text-muted) text-xs flex-shrink-0 mt-0.5">
                    <Clock size={10} />
                    {entry.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">

            <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-4 space-y-2">
              <h2 className="text-sm font-semibold text-(--text-primary) mb-3">Quick Actions</h2>

              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 text-blue-400 text-sm font-medium rounded-lg transition-colors">
                <Zap size={13} className="text-blue-400" />
                Generate from PRs
              </button>

              <a
                href="/changelog/new"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary) text-sm rounded-lg transition-colors"
              >
                <ScrollText size={13} className="text-(--text-muted)" />
                New blank entry
              </a>

              <Link
                href="/projects"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary) text-sm rounded-lg transition-colors"
              >
                <GitBranch size={13} className="text-(--text-muted)" />
                Connect a repo
              </Link>
            </div>

            <div className="bg-(--bg-raised) border border-(--border) rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
                <h2 className="text-sm font-semibold text-(--text-primary)">Unprocessed PRs</h2>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5">
                  {RECENT_PRS.length} new
                </span>
              </div>

              <div className="divide-y divide-(--border)">
                {RECENT_PRS.map((pr) => (
                  <div key={pr.number} className="px-4 py-3 hover:bg-(--bg-overlay) transition-colors">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <GitPullRequest size={11} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-(--text-muted) font-mono text-[10px]">#{pr.number}</span>
                      <span className="text-(--text-muted) text-[10px]">· {pr.merged}</span>
                    </div>
                    <p className="text-(--text-secondary) text-xs leading-snug">{pr.title}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 border-t border-(--border)">
                <button className="w-full text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1">
                  <Zap size={10} />
                  Generate changelog from all
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}