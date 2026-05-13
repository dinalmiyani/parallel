'use client';

import {
  Globe,
  Lock,
  Loader2,
  Plus,
} from 'lucide-react';

import type { GitHubRepo } from './connect-repo-modal';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
};

export default function RepoListItem({
  repo,
  connecting,
  onConnect,
}: {
  repo: GitHubRepo;
  connecting: number | null;
  onConnect: (repo: GitHubRepo) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 bg-(--bg-overlay) border border-(--border) rounded-lg hover:border-(--text-muted) transition-colors">

      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-(--text-primary) truncate">
            {repo.full_name}
          </span>

          {repo.private ? (
            <span className="flex items-center gap-0.5 text-[10px] text-(--text-muted)">
              <Lock size={8} /> Private
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[10px] text-(--text-muted)">
              <Globe size={8} /> Public
            </span>
          )}
        </div>

        {repo.description && (
          <p className="text-xs text-(--text-muted) truncate">
            {repo.description}
          </p>
        )}

        {repo.language && (
          <span className="flex items-center gap-1 text-[11px] text-(--text-muted)">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  LANG_COLORS[repo.language] ?? '#6b7280',
              }}
            />

            {repo.language}
          </span>
        )}
      </div>

      <button
        onClick={() => onConnect(repo)}
        disabled={connecting === repo.id}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
      >
        {connecting === repo.id ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Plus size={12} />
        )}

        {connecting === repo.id ? 'Connecting...' : 'Connect'}
      </button>
    </div>
  );
}