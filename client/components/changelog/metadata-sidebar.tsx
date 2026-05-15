'use client';

import { useState } from 'react';
import { ChevronDown, GitPullRequest, X, CornerDownLeft } from 'lucide-react';
import { Project } from '@/types/changlog';

const ALL_TAGS = [
  'FEATURE', 'BUG_FIX', 'IMPROVEMENT',
  'SECURITY', 'PERFORMANCE', 'BREAKING_CHANGE',
] as const;

export type Tag = typeof ALL_TAGS[number];

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

interface ExistingEntry {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  linkedPRs: { id: string; prNumber: number; title: string }[];
}

interface Props {
  version: string;
  onVersionChange: (v: string) => void;
  projects: Project[];
  selectedProjectId: string;
  onProjectChange: (id: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  notifySubscribers: boolean;
  onNotifyChange: (v: boolean) => void;
  linkedPRIds: string[];
  onOpenPRModal: () => void;
  entry: ExistingEntry | null; // null = new entry
  onDelete?: () => void;
}

export default function MetadataSidebar({
  version,
  onVersionChange,
  projects,
  selectedProjectId,
  onProjectChange,
  selectedTags,
  onTagsChange,
  notifySubscribers,
  onNotifyChange,
  linkedPRIds,
  onOpenPRModal,
  entry,
  onDelete,
}: Props) {
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showProjectMenu, setProjectMenu] = useState(false);

  const toggleTag = (tag: string) =>
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    );

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="w-[300px] flex-shrink-0 overflow-y-auto bg-(--bg-raised)">
      <div className="p-5 space-y-6">

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
            Version
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => onVersionChange(e.target.value)}
            placeholder="e.g. v1.2.0"
            className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-blue-500 font-mono transition-colors"
          />
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
            Project
          </label>
          <button
            onClick={() => setProjectMenu((p) => !p)}
            className="w-full flex items-center justify-between px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm hover:border-(--text-muted) transition-colors"
          >
            <span className={selectedProject ? 'text-(--text-primary)' : 'text-(--text-muted)'}>
              {selectedProject
                ? `${selectedProject.repoOwner}/${selectedProject.repoName}`
                : 'Select project...'}
            </span>
            <ChevronDown size={13} className="text-(--text-muted)" />
          </button>

          {showProjectMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProjectMenu(false)} />
              <div className="absolute top-full left-0 right-0 mt-1 bg-(--bg-overlay) border border-(--border) rounded-lg overflow-hidden z-20 shadow-xl">
                {projects.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-(--text-muted) text-center">
                    No projects connected
                  </p>
                ) : (
                  projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { onProjectChange(p.id); setProjectMenu(false); }}
                      className="w-full text-left px-3 py-2.5 text-sm text-(--text-secondary) hover:bg-(--bg-raised) hover:text-(--text-primary) transition-colors"
                    >
                      {p.repoOwner}/{p.repoName}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className={`flex items-center gap-1 text-[11px] border rounded-full pl-2 pr-1 py-0.5 ${TAG_COLORS[tag] ?? ''}`}
              >
                {formatTag(tag)}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <button
              onClick={() => setShowTagMenu((p) => !p)}
              className="text-[11px] border border-dashed border-(--border) rounded-full px-2 py-0.5 text-(--text-muted) hover:text-(--text-primary) hover:border-(--text-muted) transition-colors"
            >
              + Add tag
            </button>
          </div>

          {showTagMenu && (
            <div className="bg-(--bg-overlay) border border-(--border) rounded-lg overflow-hidden">
              {ALL_TAGS.filter((t) => !selectedTags.includes(t)).map((tag) => (
                <button
                  key={tag}
                  onClick={() => { toggleTag(tag); setShowTagMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-(--text-secondary) hover:bg-(--bg-raised) hover:text-(--text-primary) transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full ${TAG_COLORS[tag]?.split(' ')[0]}`} />
                  {formatTag(tag)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-(--border)" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-(--text-primary)">Notify subscribers</p>
            <p className="text-[11px] text-(--text-muted) mt-0.5">Send email on publish</p>
          </div>
          <button
            onClick={() => onNotifyChange(!notifySubscribers)}
            className={`relative w-9 h-5 rounded-full transition-colors ${notifySubscribers ? 'bg-blue-600' : 'bg-(--bg-overlay) border border-(--border)'
              }`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${notifySubscribers ? 'left-[18px]' : 'left-0.5'
              }`} />
          </button>
        </div>

        <div className="h-px bg-(--border)" />

        <div className="space-y-2">
          <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
            Linked PRs
          </label>
          {entry?.linkedPRs && entry.linkedPRs.length > 0 ? (
            <div className="space-y-1.5">
              {entry.linkedPRs.map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-start gap-2 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) rounded-lg"
                >
                  <GitPullRequest size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-mono text-(--text-muted)">#{pr.prNumber}</p>
                    <p className="text-xs text-(--text-secondary) leading-snug truncate">{pr.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : linkedPRIds.length > 0 ? (
            <p className="text-xs text-(--text-muted)">{linkedPRIds.length} PR{linkedPRIds.length !== 1 ? 's' : ''} linked</p>
          ) : (
            <p className="text-xs text-(--text-muted) italic">No PRs linked yet.</p>
          )}
          <button
            onClick={onOpenPRModal}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-(--border) rounded-lg text-xs text-(--text-muted) hover:text-(--text-primary) hover:border-(--text-muted) transition-colors"
          >
            <CornerDownLeft size={11} />
            {linkedPRIds.length > 0 ? 'Change linked PRs' : 'Link PRs'}
          </button>
        </div>

        {entry && (
          <>
            <div className="h-px bg-(--border)" />
            <div className="space-y-2 text-xs text-(--text-muted)">
              <div className="flex items-center justify-between">
                <span>Created</span>
                <span className="text-(--text-secondary)">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last edited</span>
                <span className="text-(--text-secondary)">
                  {new Date(entry.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Published</span>
                <span className="text-(--text-secondary)">
                  {entry.publishedAt
                    ? new Date(entry.publishedAt).toLocaleDateString()
                    : '—'}
                </span>
              </div>
            </div>
          </>
        )}

        {onDelete && (
          <>
            <div className="h-px bg-(--border)" />
            <button
              onClick={onDelete}
              className="w-full text-xs text-red-400 hover:text-red-300 transition-colors py-1"
            >
              Delete entry
            </button>
          </>
        )}

      </div>
    </div>
  );
}