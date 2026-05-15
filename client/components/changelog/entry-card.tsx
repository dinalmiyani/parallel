
import { formatDate, formatTag } from '@/lib/helper';
import { EntryListItem } from '@/types/changlog';
import {
  GitPullRequest,
  Clock, Eye, EyeOff, MoreHorizontal, ScrollText, Loader2, Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const TAG_COLORS: Record<string, string> = {
  FEATURE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  BUG_FIX: 'bg-red-500/10 text-red-400 border-red-500/20',
  IMPROVEMENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PERFORMANCE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  BREAKING_CHANGE: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  SECURITY: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function EntryCard({
  entry,
  onTogglePublish,
  onDelete,
  toggling,
}: {
  entry: EntryListItem;
  onTogglePublish: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  toggling: string | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative flex gap-4 p-4 bg-(--bg-raised) border border-(--border) rounded-xl hover:border-(--text-muted) transition-all">

      <div className="flex flex-col items-center pt-1 flex-shrink-0">
        <div className={`w-2 h-2 rounded-full mt-0.5 ${entry.isPublished ? 'bg-emerald-400' : 'bg-(--text-muted)'
          }`} />
        <div className="w-px flex-1 bg-(--border) mt-2 min-h-[20px]" />
      </div>

      <Link href={`/changelog/${entry.id}`} className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {entry.version && (
              <span className="font-mono text-[11px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded px-1.5 py-0.5">
                {entry.version}
              </span>
            )}
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${entry.isPublished
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

          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={(e) => e.preventDefault()}
          >
            <button
              onClick={() => onTogglePublish(entry.id, entry.isPublished)}
              disabled={toggling === entry.id}
              title={entry.isPublished ? 'Unpublish' : 'Publish'}
              className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors disabled:opacity-40"
            >
              {toggling === entry.id
                ? <Loader2 size={13} className="animate-spin" />
                : entry.isPublished
                  ? <EyeOff size={13} />
                  : <Eye size={13} />
              }
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
              >
                <MoreHorizontal size={13} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 bg-(--bg-raised) border border-(--border) rounded-lg shadow-xl z-20 w-36 overflow-hidden">
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(entry.id); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={11} /> Delete entry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-(--text-primary) leading-snug mb-1.5 group-hover:text-blue-400 transition-colors">
          {entry.title}
        </h3>

        <div className="flex items-center gap-3 text-[11px] text-(--text-muted)">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatDate(entry.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <GitPullRequest size={10} />
            {entry.linkedPRsCount} PR{entry.linkedPRsCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <ScrollText size={10} />
            {entry.projectName}
          </span>
        </div>
      </Link>

      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}