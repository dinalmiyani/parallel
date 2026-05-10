import Topbar from '@/components/topbar';
import { Users, ScrollText, GitPullRequest, TrendingUp, Eye } from 'lucide-react';

const STATS = [
  { label: 'Total Subscribers', value: '47', delta: '+8 this month', icon: Users, color: 'blue' },
  { label: 'Total Entries', value: '24', delta: '18 published', icon: ScrollText, color: 'emerald' },
  { label: 'PRs Processed', value: '63', delta: 'across 3 repos', icon: GitPullRequest, color: 'amber' },
  { label: 'Page Views', value: '1.2k', delta: '+24% this month', icon: Eye, color: 'violet' },
];

const STAT_COLORS: Record<string, { bg: string; icon: string; ring: string }> = {
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', ring: 'ring-1 ring-blue-500/20' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-1 ring-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', ring: 'ring-1 ring-amber-500/20' },
  violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', ring: 'ring-1 ring-violet-500/20' },
};

const SUBSCRIBER_DATA = [
  { week: 'Nov 18', count: 12 },
  { week: 'Nov 25', count: 18 },
  { week: 'Dec 2', count: 22 },
  { week: 'Dec 9', count: 25 },
  { week: 'Dec 16', count: 28 },
  { week: 'Dec 23', count: 33 },
  { week: 'Dec 30', count: 39 },
  { week: 'Jan 6', count: 47 },
];

const max = Math.max(...SUBSCRIBER_DATA.map(d => d.count));

const TOP_ENTRIES = [
  { title: 'Redesigned dashboard with real-time metrics', views: 342, version: 'v2.4.0' },
  { title: 'AI generation improvements and cost reduction', views: 289, version: 'v2.3.0' },
  { title: 'Fixed GitHub sync edge case on private repos', views: 198, version: 'v2.3.1' },
  { title: 'Added keyboard shortcuts for power users', views: 156, version: 'v2.2.0' },
];

const TAG_DIST = [
  { tag: 'Feature', count: 10, color: 'bg-blue-500' },
  { tag: 'Bug Fix', count: 6, color: 'bg-red-500' },
  { tag: 'Improvement', count: 5, color: 'bg-emerald-500' },
  { tag: 'Performance', count: 2, color: 'bg-cyan-500' },
  { tag: 'Breaking Change', count: 1, color: 'bg-orange-500' },
];
const totalTags = TAG_DIST.reduce((a, b) => a + b.count, 0);

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Analytics" />

      <div className="flex-1 px-6 py-6 max-w-[1100px] space-y-6">

        <div>
          <h1 className="text-xl font-semibold text-(--text-primary) tracking-tight">Analytics</h1>
          <p className="text-(--text-muted) text-sm mt-0.5">Last 30 days overview</p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map(({ label, value, delta, icon: Icon, color }) => {
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-(--text-primary)">Subscriber Growth</h2>
                <p className="text-xs text-(--text-muted) mt-0.5">Weekly new subscribers</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                <TrendingUp size={11} />
                +291% growth
              </div>
            </div>

            <div className="flex items-end gap-3 h-40">
              {SUBSCRIBER_DATA.map((d, i) => {
                const height = (d.count / max) * 100;
                const isLast = i === SUBSCRIBER_DATA.length - 1;
                return (
                  <div key={d.week} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-(--text-muted)">{d.count}</span>
                    <div className="w-full relative" style={{ height: `${height}%` }}>
                      <div
                        className={`absolute bottom-0 inset-x-0 rounded-t-md transition-all ${isLast ? 'bg-blue-500' : 'bg-(--bg-overlay) border-t border-(--border)'
                          }`}
                        style={{ height: '100%' }}
                      />
                    </div>
                    <span className="text-[10px] text-(--text-muted) -rotate-45 origin-left translate-y-2 whitespace-nowrap">
                      {d.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5">
            <h2 className="text-sm font-semibold text-(--text-primary) mb-1">Entry Types</h2>
            <p className="text-xs text-(--text-muted) mb-5">Distribution by tag</p>

            <div className="space-y-3">
              {TAG_DIST.map(({ tag, count, color }) => {
                const pct = Math.round((count / totalTags) * 100);
                return (
                  <div key={tag}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${color}`} />
                        <span className="text-xs text-(--text-secondary)">{tag}</span>
                      </div>
                      <span className="text-xs text-(--text-muted)">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-(--bg-overlay) rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-(--bg-raised) border border-(--border) rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-(--border)">
            <h2 className="text-sm font-semibold text-(--text-primary)">Top Entries by Views</h2>
          </div>
          <div className="divide-y divide-(--border)">
            {TOP_ENTRIES.map((entry, i) => {
              const maxViews = TOP_ENTRIES[0].views;
              const pct = (entry.views / maxViews) * 100;
              return (
                <div key={entry.title} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="text-sm font-mono text-(--text-muted) w-5 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-(--text-primary) font-medium truncate">{entry.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 bg-(--bg-overlay) rounded-full overflow-hidden max-w-[200px]">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-(--text-muted)">{entry.views} views</span>
                    </div>
                  </div>
                  {entry.version && (
                    <span className="font-mono text-[11px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded px-1.5 py-0.5 flex-shrink-0">
                      {entry.version}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}