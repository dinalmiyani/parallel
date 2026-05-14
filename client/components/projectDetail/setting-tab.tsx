'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ProjectDetail } from '@/types/project';
import { useApi } from '@/lib/api/client';

interface Props {
  project: ProjectDetail;
}

export default function ProjectSettingsTab({ project }: Props) {
  const api = useApi();
  const router = useRouter();

  const [name, setName] = useState(project.name);
  const [branch, setBranch] = useState(project.defaultBranch);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/projects/${project.id}`, {
        name,
        defaultBranch: branch,
      });
      toast.success('Project settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (confirmText !== project.repoName) {
      toast.error(`Type "${project.repoName}" to confirm`);
      return;
    }
    setDisconnecting(true);
    try {
      await api.delete(`/projects/${project.id}`);
      toast.success('Repository disconnected');
      router.push('/projects');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to disconnect');
      setDisconnecting(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Project Settings</h3>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted)">Display name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted)">Default branch</label>
          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) font-mono focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="bg-(--bg-raised) border border-red-500/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
        </div>

        <div>
          <p className="text-sm text-(--text-primary) mb-1">Disconnect repository</p>
          <p className="text-xs text-(--text-muted) mb-4 leading-relaxed">
            This removes the repo and all its imported PR data. Your changelog entries will be kept.
            This action cannot be undone.
          </p>

          <div className="space-y-2">
            <p className="text-xs text-(--text-muted)">
              Type <span className="font-mono text-(--text-secondary) bg-(--bg-overlay) px-1 py-0.5 rounded">{project.repoName}</span> to confirm
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={project.repoName}
              className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) font-mono placeholder:text-(--text-muted) focus:outline-none focus:border-red-500 transition-colors"
            />
            <button
              onClick={handleDisconnect}
              disabled={disconnecting || confirmText !== project.repoName}
              className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed text-sm rounded-lg transition-colors"
            >
              {disconnecting && <Loader2 size={13} className="animate-spin" />}
              {disconnecting ? 'Disconnecting...' : 'Disconnect repository'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}