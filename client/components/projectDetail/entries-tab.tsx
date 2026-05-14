'use client';

import Link from 'next/link';
import { ScrollText } from 'lucide-react';
import { EntryListItem } from '@/types/project';

const TAG_COLORS: Record<string, string> = {
  FEATURE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  BUG_FIX: 'bg-red-500/10 text-red-400 border-red-500/20',
  IMPROVEMENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PERFORMANCE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  BREAKING_CHANGE: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  SECURITY: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

function formatTag(tag: string): string {
  return tag
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

interface Props {
  entries: EntryListItem[];
}

export default function EntriesTab({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-10 h-10 rounded-xl bg-(--bg-raised) border border-(--border) flex items-center justify-center mb-3">
          <ScrollText size={18} className="text-(--text-muted)" />
        </div>
        <p className="text-sm font-medium text-(--text-primary) mb-1">No entries yet</p>
        <p className="text-xs text-(--text-muted) mb-4">
          Import PRs and generate your first changelog entry.
        </p>
        <Link
          href="/changelog/new"
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Create entry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={`/changelog/${entry.id}`}
          className="flex items-center gap-4 px-4 py-3.5 bg-(--bg-raised) border border-(--border) rounded-xl hover:border-(--text-muted) transition-all group"
        >
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.isPublished ? 'bg-emerald-400' : 'bg-(--text-muted)'
            }`} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {entry.version && (
                <span className="font-mono text-[11px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded px-1.5 py-0.5">
                  {entry.version}
                </span>
              )}
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${entry.isPublished
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-(--text-muted) bg-(--bg-overlay) border-(--border)'
                }`}>
                {entry.isPublished ? 'Published' : 'Draft'}
              </span>
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] border rounded-full px-2 py-0.5 ${TAG_COLORS[tag] ?? 'text-(--text-muted) bg-(--bg-overlay) border-(--border)'}`}
                >
                  {formatTag(tag)}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-(--text-primary) group-hover:text-blue-400 transition-colors truncate">
              {entry.title}
            </p>
          </div>

          <span className="text-xs text-(--text-muted) flex-shrink-0">
            {new Date(entry.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </Link>
      ))}
    </div>
  );
}