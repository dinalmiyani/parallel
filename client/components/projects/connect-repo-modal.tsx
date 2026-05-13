'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  GitBranch,
  Loader2,
  Search,
  X,
  AlertTriangle,
} from 'lucide-react';

import { useApi } from '@/lib/api/client';


import RepoListItem from './repo-list-item';
import { Project } from '@/types/project';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  private: boolean;
  language: string | null;
  default_branch: string;
  description: string | null;
  pushed_at: string;
}

export default function ConnectRepoModal({
  onClose,
  onConnected,
}: {
  onClose: () => void;
  onConnected: (project: Project) => void;
}) {
  const api = useApi();

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get<GitHubRepo[]>('/github/repos');
      setRepos(data);
      setFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repos');
    } finally {
      setLoading(false);
    }
  };

  const connectRepo = async (repo: GitHubRepo) => {
    setConnecting(repo.id);

    try {
      const project = await api.post<Project>('/projects', {
        name: repo.name,
        repoName: repo.name,
        repoOwner: repo.owner.login,
        githubRepoId: repo.id,
        defaultBranch: repo.default_branch,
      });

      toast.success(`${repo.full_name} connected successfully`);

      onConnected(project);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect repo');
    } finally {
      setConnecting(null);
    }
  };

  const filtered = repos.filter(
    (r) =>
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-(--bg-raised) border border-(--border) rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between px-5 py-4 border-b border-(--border)">
          <div>
            <h3 className="text-sm font-semibold text-(--text-primary)">
              Connect Repository
            </h3>

            <p className="text-xs text-(--text-muted) mt-0.5">
              Select a GitHub repo to connect to your workspace
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5">

          {!fetched ? (
            <div className="flex flex-col items-center gap-4 py-6">

              <div className="w-12 h-12 rounded-xl bg-(--bg-overlay) border border-(--border) flex items-center justify-center">
                <GitBranch size={20} className="text-(--text-muted)" />
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-(--text-primary) mb-1">
                  Load your GitHub repositories
                </p>

                <p className="text-xs text-(--text-muted)">
                  We'll fetch all repos you have access to
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 w-full">
                  <AlertTriangle size={13} />
                  {error}
                </div>
              )}

              <button
                onClick={fetchRepos}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <GitBranch size={14} />
                )}

                {loading ? 'Loading repos...' : 'Load repositories'}
              </button>
            </div>
          ) : (
            <>
              <div className="relative mb-3">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full pl-8 pr-4 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {filtered.map((repo) => (
                  <RepoListItem
                    key={repo.id}
                    repo={repo}
                    connecting={connecting}
                    onConnect={connectRepo}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}