'use client';

import { useState, useEffect } from 'react';
import { GitPullRequest, X, Zap, Loader2 } from 'lucide-react';
import { useApi } from '@/lib/api/client';

interface StoredPR {
  id: string;
  prNumber: number;
  title: string;
  mergedAt: string;
  used: boolean;
}

interface Props {
  projectId: string;
  onClose: () => void;
  onGenerate: (prIds: string[]) => void;
  preSelectedIds: string[];
}

export default function PRSelectModal({
  projectId,
  onClose,
  onGenerate,
  preSelectedIds,
}: Props) {
  const api = useApi();

  const [prs, setPRs] = useState<StoredPR[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>(preSelectedIds);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    api
      .get<StoredPR[]>(`/github/prs/${projectId}?unused=true`)
      .then(setPRs)
      .catch(() => setPRs([]))
      .finally(() => setLoading(false));
  }, [projectId]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const handleGenerate = async () => {
    if (selected.length === 0) return;
    setGenerating(true);
    onGenerate(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-(--bg-raised) border border-(--border) rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between px-5 py-4 border-b border-(--border)">
          <div>
            <h3 className="text-sm font-semibold text-(--text-primary)">Select Pull Requests</h3>
            <p className="text-xs text-(--text-muted) mt-0.5">
              Choose PRs to generate changelog from
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-(--border)">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={18} className="animate-spin text-(--text-muted)" />
            </div>
          ) : prs.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-(--text-muted)">No unused PRs found.</p>
              <p className="text-xs text-(--text-muted) mt-1">
                Import PRs from the project detail page first.
              </p>
            </div>
          ) : (
            prs.map((pr) => (
              <label
                key={pr.id}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-(--bg-overlay) cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(pr.id)}
                  onChange={() => toggle(pr.id)}
                  className="mt-0.5 accent-blue-600 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <GitPullRequest size={11} className="text-emerald-500" />
                    <span className="font-mono text-[11px] text-(--text-muted)">
                      #{pr.prNumber}
                    </span>
                    <span className="text-[11px] text-(--text-muted)">
                      · {new Date(pr.mergedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-(--text-primary) leading-snug">{pr.title}</p>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-(--border)">
          <span className="text-xs text-(--text-muted)">
            {selected.length} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={selected.length === 0 || generating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {generating
                ? <Loader2 size={13} className="animate-spin" />
                : <Zap size={13} />
              }
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}