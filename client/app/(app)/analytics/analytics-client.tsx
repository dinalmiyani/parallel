'use client';

import Topbar from '@/components/topbar';
import Link from 'next/link';
import {
  Users, ScrollText, GitPullRequest,
  TrendingUp, Zap, Clock,
} from 'lucide-react';
import { AnalyticsData } from '@/types/analytics';

const TAG_BAR_COLORS: Record<string, string> = {
  FEATURE: 'bg-blue-500',
  BUG_FIX: 'bg-red-500',
  IMPROVEMENT: 'bg-emerald-500',
  PERFORMANCE: 'bg-cyan-500',
  BREAKING_CHANGE: 'bg-orange-500',
  SECURITY: 'bg-purple-500',
};

const TAG_TEXT_COLORS: Record<string, string> = {
  FEATURE: 'text-blue-400',
  BUG_FIX: 'text-red-400',
  IMPROVEMENT: 'text-emerald-400',
  PERFORMANCE: 'text-cyan-400',
  BREAKING_CHANGE: 'text-orange-400',
  SECURITY: 'text-purple-400',
};

function formatTag(tag: string): string {
  return tag.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  if (hours < 168) return `${Math.floor(hours / 24)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function BarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="flex items-end gap-2 h-36 mt-4">
      {data.map((d, i) => {
        const heightPct = max === 0 ? 0 : (d.count / max) * 100;
        const isLast = i === data.length - 1;

        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-(--text-muted)">{d.count}</span>

            <div className="w-full relative" style={{ height: `${Math.max(heightPct, 4)}%` }}>
              <div
                className={`absolute bottom-0 inset-x-0 rounded-t-md transition-all ${isLast ? 'bg-blue-500' : 'bg-(--bg-overlay) border-t-2 border-(--border)'
                  }`}
                style={{ height: '100%' }}
              />
            </div>

            <span className="text-[9px] text-(--text-muted) -rotate-45 origin-left whitespace-nowrap translate-y-2">
              {d.date}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  data: AnalyticsData;
}

export default function AnalyticsClient({ data }: Props) {
  const { stats, subscriberGrowth, entriesByTag, recentActivity } = data;

  const totalTags = entriesByTag.reduce((sum, t) => sum + t.count, 0);
  const growthMax = Math.max(...subscriberGrowth.map(d => d.count), 1);

  const lastCount = subscriberGrowth[subscriberGrowth.length - 1]?.count ?? 0;
  const prevCount = subscriberGrowth[subscriberGrowth.length - 2]?.count ?? 0;
  const growthDelta = lastCount - prevCount;

  const STAT_ITEMS = [
    {
      label: 'Total Subscribers',
      value: stats.totalSubscribers,
      delta: growthDelta > 0 ? `+${growthDelta} this week` : 'No new this week',
      icon: Users,
      color: 'blue' as const,
    },
    {
      label: 'Total Entries',
      value: stats.totalEntries,
      delta: `${stats.publishedEntries} published`,
      icon: ScrollText,
      color: 'emerald' as const,
    },
    {
      label: 'PRs Processed',
      value: stats.prsProcessed,
      delta: 'used in changelogs',
      icon: GitPullRequest,
      color: 'amber' as const,
    },
    {
      label: 'AI Generations',
      value: stats.aiGenerationsUsed,
      delta: 'entries from AI',
      icon: Zap,
      color: 'violet' as const,
    },
  ];

  const STAT_COLORS = {
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', ring: 'ring-1 ring-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-1 ring-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', ring: 'ring-1 ring-amber-500/20' },
    violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', ring: 'ring-1 ring-violet-500/20' },
  };

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Analytics" />

      <div className="flex-1 px-6 py-6 max-w-[1100px] space-y-6">

        <div>
          <h1 className="text-xl font-semibold text-(--text-primary) tracking-tight">Analytics</h1>
          <p className="text-(--text-muted) text-sm mt-0.5">
            Overview of your changelog activity
          </p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_ITEMS.map(({ label, value, delta, icon: Icon, color }) => {
            const c = STAT_COLORS[color];
            return (
              <div key={label} className="bg-(--bg-raised) border border-(--border) rounded-xl p-4">
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

          <div className="xl:col-span-2 bg-(--bg-raised) border border-(--border) rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-semibold text-(--text-primary)">Subscriber Growth</h2>
                <p className="text-xs text-(--text-muted) mt-0.5">Cumulative confirmed subscribers</p>
              </div>
              {growthDelta > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                  <TrendingUp size={11} />
                  +{growthDelta} this week
                </div>
              )}
            </div>

            {subscriberGrowth.length === 0 || growthMax === 0 ? (
              <div className="flex items-center justify-center h-36 mt-4">
                <p className="text-sm text-(--text-muted)">No subscriber data yet</p>
              </div>
            ) : (
              <BarChart data={subscriberGrowth} />
            )}
          </div>

          <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5">
            <h2 className="text-sm font-semibold text-(--text-primary) mb-1">Entry Types</h2>
            <p className="text-xs text-(--text-muted) mb-5">Distribution by tag</p>

            {entriesByTag.length === 0 ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-sm text-(--text-muted)">No entries yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entriesByTag.map(({ tag, count }) => {
                  const pct = Math.round((count / totalTags) * 100);
                  return (
                    <div key={tag}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${TAG_BAR_COLORS[tag] ?? 'bg-gray-500'}`} />
                          <span className={`text-xs ${TAG_TEXT_COLORS[tag] ?? 'text-(--text-muted)'}`}>
                            {formatTag(tag)}
                          </span>
                        </div>
                        <span className="text-xs text-(--text-muted)">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-(--bg-overlay) rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${TAG_BAR_COLORS[tag] ?? 'bg-gray-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-(--bg-raised) border border-(--border) rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-(--border)">
            <h2 className="text-sm font-semibold text-(--text-primary)">Recent Activity</h2>
          </div>

          {recentActivity.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-(--text-muted)">No activity yet</p>
            </div>
          ) : (
            <div className="divide-y divide-(--border)">
              {recentActivity.map((entry, i) => (
                <Link
                  key={entry.id}
                  href={`/changelog/${entry.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-(--bg-overlay) transition-colors group"
                >
                  <span className="text-sm font-mono text-(--text-muted) w-5 flex-shrink-0">
                    {i + 1}
                  </span>

                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.isPublished ? 'bg-emerald-400' : 'bg-(--text-muted)'
                    }`} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-(--text-primary) font-medium truncate group-hover:text-blue-400 transition-colors">
                      {entry.title}
                    </p>
                    <p className="text-[11px] text-(--text-muted) mt-0.5">
                      {entry.projectName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {entry.version && (
                      <span className="font-mono text-[11px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded px-1.5 py-0.5">
                        {entry.version}
                      </span>
                    )}
                    <span className="text-[11px] text-(--text-muted) flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}