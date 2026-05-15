'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import Topbar from '@/components/topbar';
import {
  Plus, Search, Zap, ScrollText
} from 'lucide-react';
import { EntryListItem } from '@/types/changlog';
import { useApi } from '@/lib/api/client';
import EntryCard from './entry-card';

const FILTER_OPTIONS = ['All', 'Published', 'Draft'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

export default function ChangelogClient({
  initialEntries,
}: {
  initialEntries: EntryListItem[];
}) {
  const api = useApi();

  const [entries, setEntries] = useState<EntryListItem[]>(initialEntries);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterOption>('All');
  const [toggling, setToggling] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesFilter =
        filter === 'All' ? true :
          filter === 'Published' ? e.isPublished :
            filter === 'Draft' ? !e.isPublished : true;

      const matchesSearch =
        search === '' ? true :
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.projectName.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [entries, filter, search]);

  const publishedCount = entries.filter((e) => e.isPublished).length;
  const draftCount = entries.filter((e) => !e.isPublished).length;

  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    setToggling(id);
    try {
      await api.patch(`/changelog/${id}/publish`, {
        isPublished: !currentlyPublished,
        notifySubscribers: !currentlyPublished, // notify only when publishing
      });

      setEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, isPublished: !currentlyPublished, publishedAt: !currentlyPublished ? new Date().toISOString() : null }
            : e,
        ),
      );

      toast.success(currentlyPublished ? 'Entry unpublished' : 'Entry published');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update entry');
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    try {
      await api.delete(`/changelog/${id}`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success('Entry deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Changelog" />

      <div className="flex-1 px-6 py-6 max-w-[1100px] space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-(--text-primary) tracking-tight">Changelog</h1>
            <p className="text-(--text-muted) text-sm mt-0.5">
              {publishedCount} published · {draftCount} draft{draftCount !== 1 ? 's' : ''}
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

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-8 pr-4 py-2 bg-(--bg-raised) border border-(--border) rounded-lg text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${filter === f
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                  : 'bg-(--bg-raised) text-(--text-muted) border-(--border) hover:text-(--text-primary) hover:border-(--text-muted)'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && entries.length === 0 ? (
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-(--text-muted)">
              No entries match your search.{' '}
              <button
                onClick={() => { setSearch(''); setFilter('All'); }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear filters
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onTogglePublish={handleTogglePublish}
                onDelete={handleDelete}
                toggling={toggling}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}