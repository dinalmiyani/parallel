'use client';

import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { useApi } from '@/lib/api/client';
import { useState } from 'react';
import { Project } from '@/types/project';

export default function DisconnectModal({
  project,
  onClose,
  onDisconnected,
}: {
  project: Project;
  onClose: () => void;
  onDisconnected: (id: string) => void;
}) {
  const api = useApi();

  const [loading, setLoading] = useState(false);

  const disconnect = async () => {
    setLoading(true);

    try {
      await api.delete(`/projects/${project.id}`);

      toast.success(
        `${project.repoOwner}/${project.repoName} disconnected`,
      );

      onDisconnected(project.id);
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Failed to disconnect',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-(--bg-raised) border border-(--border) rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl">

        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <AlertTriangle
            size={18}
            className="text-red-400"
          />
        </div>

        <h3 className="text-sm font-semibold text-(--text-primary) mb-1">
          Disconnect repository?
        </h3>

        <p className="text-xs text-(--text-muted) mb-5 leading-relaxed">
          This will remove{' '}
          <span className="text-(--text-secondary) font-medium">
            {project.repoOwner}/{project.repoName}
          </span>{' '}
          and all its imported PRs. Your changelog entries will be kept.
        </p>

        <div className="flex gap-2">

          <button
            onClick={onClose}
            className="flex-1 py-2 bg-(--bg-overlay) border border-(--border) text-(--text-secondary) text-sm rounded-lg hover:border-(--text-muted) transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={disconnect}
            disabled={loading}
            className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <Loader2
                size={13}
                className="animate-spin"
              />
            )}

            {loading
              ? 'Disconnecting...'
              : 'Disconnect'}
          </button>
        </div>
      </div>
    </div>
  );
}