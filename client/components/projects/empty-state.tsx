'use client';

import { GitBranch, Plus } from 'lucide-react';

export default function EmptyState({
  onConnect,
}: {
  onConnect: () => void;
}) {
  return (
    <div className="xl:col-span-2 flex flex-col items-center justify-center py-16 text-center">

      <div className="w-12 h-12 rounded-xl bg-(--bg-raised) border border-(--border) flex items-center justify-center mb-4">
        <GitBranch
          size={20}
          className="text-(--text-muted)"
        />
      </div>

      <h3 className="text-(--text-primary) font-semibold mb-1">
        No repos connected
      </h3>

      <p className="text-(--text-muted) text-sm mb-4 max-w-xs">
        Connect a GitHub repo to start importing PRs and generating changelogs.
      </p>

      <button
        onClick={onConnect}
        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus size={14} />
        Connect your first repo
      </button>
    </div>
  );
}