'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, Trash2, Download } from 'lucide-react';
import { useApi } from '@/lib/api/client';

export default function DangerZonePage() {
  const api = useApi();
  const router = useRouter();
  const { signOut } = useAuth();

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletingEntries, setDeletingEntries] = useState(false);
  const [deletingWorkspace, setDeletingWorkspace] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleDeleteEntries = async () => {
    if (!confirm('Delete ALL changelog entries? This cannot be undone.')) return;
    setDeletingEntries(true);
    try {
      const entries = await api.get<{ id: string }[]>('/changelog');
      await Promise.all(entries.map((e) => api.delete(`/changelog/${e.id}`)));
      toast.success(`Deleted ${entries.length} entries`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete entries');
    } finally {
      setDeletingEntries(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const entries = await api.get<object[]>('/changelog');
      const blob = new Blob([JSON.stringify(entries, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `parallel-changelog-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to export');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (deleteConfirm !== 'delete my workspace') {
      toast.error('Type "delete my workspace" to confirm');
      return;
    }
    setDeletingWorkspace(true);
    try {
      await signOut();
      router.push('/sign-in');
      toast.success('Workspace deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete workspace');
      setDeletingWorkspace(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">

      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <AlertTriangle size={16} className="text-red-400" />
          <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-sm text-(--text-muted)">
          These actions are irreversible. Please be certain.
        </p>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-(--text-primary)">Export all data</p>
            <p className="text-xs text-(--text-muted) mt-0.5 leading-relaxed">
              Download all your changelog entries as a JSON file.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) hover:text-(--text-primary) text-sm rounded-lg transition-colors"
          >
            {exporting
              ? <Loader2 size={13} className="animate-spin" />
              : <Download size={13} />
            }
            Export JSON
          </button>
        </div>
      </div>

      <div className="bg-(--bg-raised) border border-red-500/20 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-(--text-primary)">
              Delete all changelog entries
            </p>
            <p className="text-xs text-(--text-muted) mt-0.5 leading-relaxed">
              Permanently removes all entries. Your connected repos and subscribers are kept.
            </p>
          </div>
          <button
            onClick={handleDeleteEntries}
            disabled={deletingEntries}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 text-sm rounded-lg transition-colors"
          >
            {deletingEntries
              ? <Loader2 size={13} className="animate-spin" />
              : <Trash2 size={13} />
            }
            Delete entries
          </button>
        </div>
      </div>

      <div className="bg-(--bg-raised) border border-red-500/20 rounded-xl p-5 space-y-4">
        <div>
          <p className="text-sm font-medium text-red-400">Delete workspace</p>
          <p className="text-xs text-(--text-muted) mt-0.5 leading-relaxed">
            Permanently deletes your workspace, all entries, repos, and subscribers.
            This cannot be undone.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-(--text-muted)">
            Type{' '}
            <span className="font-mono text-(--text-secondary) bg-(--bg-overlay) px-1 py-0.5 rounded">
              delete my workspace
            </span>{' '}
            to confirm
          </p>
          <input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="delete my workspace"
            className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) font-mono placeholder:text-(--text-muted) focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            onClick={handleDeleteWorkspace}
            disabled={
              deletingWorkspace ||
              deleteConfirm !== 'delete my workspace'
            }
            className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed text-sm rounded-lg transition-colors"
          >
            {deletingWorkspace && <Loader2 size={13} className="animate-spin" />}
            Delete workspace permanently
          </button>
        </div>
      </div>

    </div>
  );
}