import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Topbar from '@/components/topbar';
import Link from 'next/link';
import {
  ScrollText, GitPullRequest, Users, TrendingUp,
  ExternalLink, Clock, Zap, ChevronRight, GitBranch,
  AlertCircle,
} from 'lucide-react';
import { EntryListItem, ProjectDetail } from '@/types/project';
import { apiServer } from '@/lib/api/server';

interface UsageData {
  plan: string;
  usage: {
    projects: number;
    entries: number;
    aiGenerations: number;
    members: number;
  };
  limits: {
    maxProjects: number | null;
    maxEntries: number | null;
    maxAiGenerations: number | null;
    maxMembers: number | null;
  };
}

interface GitHubStatus {
  connected: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  if (hours < 168) return `${Math.floor(hours / 24)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const TAG_COLORS: Record<string, string> = {
  FEATURE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  BUG_FIX: 'bg-red-500/10 text-red-400 border-red-500/20',
  IMPROVEMENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PERFORMANCE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  BREAKING_CHANGE: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  SECURITY: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

function formatTag(tag: string): string {
  return tag.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const [entries, projects, usage, githubStatus, settings] = await Promise.all([
    apiServer().get<EntryListItem[]>('/changelog').catch(() => [] as EntryListItem[]),
    apiServer().get<ProjectDetail[]>('/projects').catch(() => [] as ProjectDetail[]),
    apiServer().get<UsageData>('/subscription/usage').catch(() => null),
    apiServer().get<GitHubStatus>('/github/status').catch(() => ({ connected: false })),
    apiServer().get<{ slug: string }>('/settings').catch(() => null),
  ]);

  const publicUrl = `/${settings?.slug}/changelog`;

  const publishedCount = entries.filter(e => e.isPublished).length;
  const draftCount = entries.filter(e => !e.isPublished).length;
  const totalPRsReady = projects.reduce((sum, p) => sum + p.unusedPRsCount, 0);
  const recentEntries = entries.slice(0, 5);

  const STAT_COLORS = {
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', ring: 'ring-1 ring-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-1 ring-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', ring: 'ring-1 ring-amber-500/20' },
    violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', ring: 'ring-1 ring-violet-500/20' },
  };

  const STATS = [
    {
      label: 'Total Entries',
      value: entries.length.toString(),
      delta: `${publishedCount} published`,
      icon: ScrollText,
      color: 'blue' as const,
    },
    {
      label: 'Published',
      value: publishedCount.toString(),
      delta: `${draftCount} draft${draftCount !== 1 ? 's' : ''}`,
      icon: TrendingUp,
      color: 'emerald' as const,
    },
    {
      label: 'PRs Available',
      value: totalPRsReady.toString(),
      delta: 'ready to generate',
      icon: GitPullRequest,
      color: 'amber' as const,
    },
    {
      label: 'Connected Repos',
      value: projects.length.toString(),
      delta: usage ? `${usage.limits.maxProjects === null ? '∞' : usage.limits.maxProjects} max on ${usage.plan}` : '',
      icon: GitBranch,
      color: 'violet' as const,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Dashboard" />

      <div className="flex-1 px-6 py-6 space-y-6 max-w-[1200px]">

        {!githubStatus.connected && (
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-400">
                Connect your GitHub account to start importing PRs and generating changelogs.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="flex-shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Connect GitHub
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-(--text-primary) tracking-tight">
              Good morning 👋
            </h1>
            <p className="text-(--text-muted) text-sm mt-0.5">
              Here's what's happening with your changelog.
            </p>
          </div>
          {projects.length > 0 && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary) text-xs font-medium rounded-lg transition-all"
            >
              <ExternalLink size={11} />
              View public page
            </a>
          )}
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
                {delta && <p className="text-(--text-muted) text-xs mt-1">{delta}</p>}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 bg-(--bg-raised) border border-(--border) rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
              <h2 className="text-sm font-semibold text-(--text-primary)">Recent Entries</h2>
              <Link
                href="/changelog"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-0.5"
              >
                View all <ChevronRight size={11} />
              </Link>
            </div>

            {recentEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <ScrollText size={20} className="text-(--text-muted) mb-3" />
                <p className="text-sm text-(--text-primary) font-medium mb-1">No entries yet</p>
                <p className="text-xs text-(--text-muted) mb-3">
                  Connect a repo and generate your first changelog.
                </p>
                <Link
                  href="/changelog/new"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Create first entry →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-(--border)">
                {recentEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/changelog/${entry.id}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-(--bg-overlay) transition-colors cursor-pointer group"
                  >
                    <div className="mt-1.5 flex-shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${entry.isPublished ? 'bg-emerald-400' : 'bg-(--text-muted)'
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {entry.version && (
                          <span className="font-mono text-[10px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded px-1.5 py-0.5">
                            {entry.version}
                          </span>
                        )}
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${entry.isPublished
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-(--text-muted) bg-(--bg-overlay) border-(--border)'
                          }`}>
                          {entry.isPublished ? 'published' : 'draft'}
                        </span>
                        {entry.tags.slice(0, 2).map(tag => (
                          <span key={tag} className={`text-[10px] border rounded-full px-2 py-0.5 ${TAG_COLORS[tag] ?? ''}`}>
                            {formatTag(tag)}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-(--text-primary) group-hover:text-blue-400 transition-colors leading-snug truncate">
                        {entry.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-(--text-muted)">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {formatDate(entry.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ScrollText size={10} /> {entry.projectName}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">

            <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-4 space-y-2">
              <h2 className="text-sm font-semibold text-(--text-primary) mb-3">Quick Actions</h2>

              <Link
                href="/changelog/new"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 text-blue-400 text-sm font-medium rounded-lg transition-colors"
              >
                <Zap size={13} className="text-blue-400" />
                Generate from PRs
              </Link>

              <Link
                href="/changelog/new"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary) text-sm rounded-lg transition-colors"
              >
                <ScrollText size={13} className="text-(--text-muted)" />
                New blank entry
              </Link>

              <Link
                href="/projects"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary) text-sm rounded-lg transition-colors"
              >
                <GitBranch size={13} className="text-(--text-muted)" />
                Connect a repo
              </Link>
            </div>

            {projects.filter(p => p.unusedPRsCount > 0).length > 0 && (
              <div className="bg-(--bg-raised) border border-(--border) rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
                  <h2 className="text-sm font-semibold text-(--text-primary)">PRs Ready</h2>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5">
                    {totalPRsReady} total
                  </span>
                </div>

                <div className="divide-y divide-(--border)">
                  {projects
                    .filter(p => p.unusedPRsCount > 0)
                    .slice(0, 4)
                    .map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-(--bg-overlay) transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-(--text-primary) truncate">
                            {project.repoOwner}/{project.repoName}
                          </p>
                        </div>
                        <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5 flex-shrink-0 ml-2">
                          {project.unusedPRsCount} PR{project.unusedPRsCount !== 1 ? 's' : ''}
                        </span>
                      </Link>
                    ))}
                </div>

                <div className="px-4 py-2.5 border-t border-(--border)">
                  <Link
                    href="/projects"
                    className="w-full text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
                  >
                    View all projects <ChevronRight size={11} />
                  </Link>
                </div>
              </div>
            )}

            {usage && (
              <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-(--text-primary)">Usage</h2>
                  <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                    {usage.plan}
                  </span>
                </div>

                {[
                  { label: 'Entries', used: usage.usage.entries, limit: usage.limits.maxEntries },
                  { label: 'AI uses', used: usage.usage.aiGenerations, limit: usage.limits.maxAiGenerations },
                  { label: 'Repos', used: usage.usage.projects, limit: usage.limits.maxProjects },
                ].map(({ label, used, limit }) => {
                  const pct = limit ? Math.min((used / limit) * 100, 100) : 0;
                  const over = limit ? used >= limit : false;
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-(--text-muted)">{label}</span>
                        <span className={`text-xs ${over ? 'text-red-400' : 'text-(--text-secondary)'}`}>
                          {used}/{limit === null ? '∞' : limit}
                        </span>
                      </div>
                      {limit !== null && (
                        <div className="h-1 bg-(--bg-overlay) rounded-full overflow-hidden">
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

                {usage.plan === 'FREE' && (
                  <Link
                    href="/settings/billing"
                    className="w-full text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1 mt-1"
                  >
                    Upgrade plan <ChevronRight size={11} />
                  </Link>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}