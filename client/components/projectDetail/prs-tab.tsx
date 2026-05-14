'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  GitPullRequest, Clock, CheckCircle2,
  Zap, RefreshCw, Loader2,
} from 'lucide-react';
import { StoredPR } from '@/types/project';
import { useApi } from '@/lib/api/client';

interface Props {
  projectId: string;
  initialPRs: StoredPR[];
}

export default function PRsTab({ projectId, initialPRs }: Props) {
  const api = useApi();
  const router = useRouter();
  const [prs, setPRs] = useState<StoredPR[]>(initialPRs);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [generating, setGenerating] = useState(false);

  const unusedPRs = prs.filter((pr) => !pr.used);

  const togglePR = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const toggleAll = () =>
    setSelectedIds(
      selectedIds.length === unusedPRs.length
        ? []
        : unusedPRs.map((pr) => pr.id),
    );

  const handleImport = async () => {
    setImporting(true);
    try {
      const result = await api.post<{
        imported: number;
        skipped: number;
        prs: StoredPR[];
      }>('/github/import', { projectId });

      setPRs(result.prs);
      setSelectedIds([]);

      if (result.imported === 0) {
        toast.info('No new PRs found — everything is up to date');
      } else {
        toast.success(`Imported ${result.imported} new PR${result.imported !== 1 ? 's' : ''}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to import PRs');
    } finally {
      setImporting(false);
    }
  };

  const handleGenerate = async () => {
    if (selectedIds.length === 0) return;
    setGenerating(true);
    try {
      const result = await api.post<{
        title: string;
        content: string;
        suggestedTags: string[];
        aiDraft: string;
      }>('/ai/generate', {
        projectId,
        prIds: selectedIds,
      });

      sessionStorage.setItem(
        'ai_draft',
        JSON.stringify({
          projectId,
          prIds: selectedIds,
          title: result.title,
          content: result.content,
          suggestedTags: result.suggestedTags,
          aiDraft: result.aiDraft,
        }),
      );

      toast.success('AI draft generated — opening editor');
      router.push('/changelog/new');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {unusedPRs.length > 0 && (
            <label className="flex items-center gap-2 text-xs text-(--text-muted) cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selectedIds.length === unusedPRs.length && unusedPRs.length > 0}
                onChange={toggleAll}
              />
              Select all unused ({unusedPRs.length})
            </label>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {generating
                ? <Loader2 size={13} className="animate-spin" />
                : <Zap size={13} />
              }
              {generating
                ? 'Generating...'
                : `Generate from ${selectedIds.length} PR${selectedIds.length !== 1 ? 's' : ''}`
              }
            </button>
          )}

          <button
            onClick={handleImport}
            disabled={importing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) text-sm rounded-lg transition-colors"
          >
            {importing
              ? <Loader2 size={12} className="animate-spin" />
              : <RefreshCw size={12} />
            }
            {importing ? 'Importing...' : 'Import PRs'}
          </button>
        </div>
      </div>

      {prs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-10 h-10 rounded-xl bg-(--bg-raised) border border-(--border) flex items-center justify-center mb-3">
            <GitPullRequest size={18} className="text-(--text-muted)" />
          </div>
          <p className="text-sm font-medium text-(--text-primary) mb-1">No PRs yet</p>
          <p className="text-xs text-(--text-muted) mb-4">
            Import your merged pull requests to start generating changelogs.
          </p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {importing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            {importing ? 'Importing...' : 'Import PRs'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {prs.map((pr) => (
            <div
              key={pr.id}
              className={`flex items-start gap-3 px-4 py-3.5 bg-(--bg-raised) border rounded-xl transition-all ${pr.used
                  ? 'border-(--border) opacity-50'
                  : selectedIds.includes(pr.id)
                    ? 'border-blue-500/40 bg-blue-500/5'
                    : 'border-(--border) hover:border-(--text-muted)'
                }`}
            >
              {pr.used ? (
                <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <input
                  type="checkbox"
                  className="mt-0.5 accent-blue-600 flex-shrink-0"
                  checked={selectedIds.includes(pr.id)}
                  onChange={() => togglePR(pr.id)}
                />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <GitPullRequest size={12} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-mono text-[11px] text-(--text-muted)">
                    #{pr.prNumber}
                  </span>
                  {pr.used && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-1.5 py-0.5">
                      Used
                    </span>
                  )}
                </div>
                <p className="text-sm text-(--text-primary) font-medium leading-snug">
                  {pr.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-(--text-muted)">
                  <Clock size={10} />
                  Merged {new Date(pr.mergedAt).toLocaleDateString()} by {pr.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}