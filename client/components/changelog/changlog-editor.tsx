'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft, Save, Eye, MoreHorizontal,
  Zap, Clock, Loader2, ChevronDown,
} from 'lucide-react';
import { useApi } from '@/lib/api/client';
import { EntryDetail, Project } from '@/types/changlog';
import EditorToolbar from './editor-toolbar';
import MetadataSidebar from './metadata-sidebar';
import PRSelectModal from './pr-model';

interface Props {
  entry: EntryDetail;
  projects: Project[];
}

export default function ChangelogEditorClient({ entry, projects }: Props) {
  const api = useApi();
  const router = useRouter();

  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [version, setVersion] = useState(entry.version ?? '');
  const [selectedTags, setSelectedTags] = useState<string[]>(entry.tags);
  const [projectId, setProjectId] = useState(entry.projectId);
  const [notifySubscribers, setNotify] = useState(true);
  const [linkedPRIds, setLinkedPRIds] = useState<string[]>(
    entry.linkedPRs.map((pr) => pr.id),
  );
  const [isPublished, setIsPublished] = useState(entry.isPublished);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showPRModal, setShowPRModal] = useState(false);
  const [showMoreMenu, setMoreMenu] = useState(false);
  const [showAiDraft, setShowAiDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsDirty(true);
  }, [title, content, version, selectedTags]);

  useEffect(() => {
    if (!isDirty) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => handleSave(false), 30_000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [isDirty, title, content, version, selectedTags]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [title, content, version, selectedTags]);

  const handleSave = useCallback(
    async (showToast = true) => {
      setSaving(true);
      try {
        await api.patch(`/changelog/${entry.id}`, {
          title,
          content,
          version: version || undefined,
          tags: selectedTags,
          prIds: linkedPRIds,
        });
        setLastSaved(new Date());
        setIsDirty(false);
        if (showToast) toast.success('Draft saved');
      } catch (err) {
        if (showToast) toast.error(err instanceof Error ? err.message : 'Failed to save');
      } finally {
        setSaving(false);
      }
    },
    [entry.id, title, content, version, selectedTags, linkedPRIds],
  );

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.patch(`/changelog/${entry.id}`, { title, content, version, tags: selectedTags });
      await api.patch(`/changelog/${entry.id}/publish`, {
        isPublished: !isPublished,
        notifySubscribers: !isPublished && notifySubscribers,
      });
      setIsPublished((p) => !p);
      toast.success(isPublished ? 'Entry unpublished' : 'Entry published!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this entry permanently? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/changelog/${entry.id}`);
      toast.success('Entry deleted');
      router.push('/changelog');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
    }
  };

  const handleRegenerate = async (prIds: string[]) => {
    setRegenerating(true);
    setShowPRModal(false);
    try {
      const result = await api.post<{
        title: string;
        content: string;
        suggestedTags: string[];
        aiDraft: string;
      }>('/ai/generate', { projectId, prIds });

      setTitle(result.title);
      setContent(result.content);
      setSelectedTags(result.suggestedTags);
      setLinkedPRIds(prIds);
      toast.success('AI draft regenerated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Regeneration failed');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-(--bg-base) overflow-hidden">

      <header className="h-14 flex-shrink-0 border-b border-(--border) bg-(--bg-raised)/80 backdrop-blur-md flex items-center justify-between px-4 z-30">

        <div className="flex items-center gap-3">
          <Link
            href="/changelog"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="h-4 w-px bg-(--border)" />

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${isPublished
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-(--text-muted) bg-(--bg-overlay) border-(--border)'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-(--text-muted)'
              }`} />
            {isPublished ? 'Published' : 'Draft'}
          </div>

          <span className="text-[11px] text-(--text-muted) flex items-center gap-1">
            {saving ? (
              <><Loader2 size={10} className="animate-spin" /> Saving...</>
            ) : lastSaved ? (
              <><Clock size={10} /> Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
            ) : isDirty ? (
              'Unsaved changes'
            ) : null}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !isDirty}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) disabled:opacity-40 text-(--text-secondary) text-sm rounded-lg transition-colors"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {publishing && <Loader2 size={13} className="animate-spin" />}
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>

          <div className="relative">
            <button
              onClick={() => setMoreMenu((p) => !p)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
            >
              <MoreHorizontal size={15} />
            </button>
            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMoreMenu(false)} />
                <div className="absolute right-0 top-10 bg-(--bg-raised) border border-(--border) rounded-lg shadow-xl z-20 w-44 overflow-hidden">
                  {isPublished && (
                    <a
                      href="#"
                      target="_blank"
                      className="flex items-center gap-2 px-3 py-2.5 text-xs text-(--text-secondary) hover:bg-(--bg-overlay) hover:text-(--text-primary) transition-colors"
                    >
                      <Eye size={12} /> View on public page
                    </a>
                  )}
                  <button
                    onClick={() => { setMoreMenu(false); handleDelete(); }}
                    disabled={deleting}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    {deleting ? <Loader2 size={12} className="animate-spin" /> : null}
                    Delete entry
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 flex flex-col overflow-hidden border-r border-(--border)">

          <div className="px-10 pt-8 pb-4">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title..."
              rows={2}
              className="w-full bg-transparent text-2xl font-bold text-(--text-primary) placeholder:text-(--text-muted) resize-none focus:outline-none leading-tight"
            />
          </div>

          <EditorToolbar
            showAiButton
            onRegenerate={() => setShowPRModal(true)}
          />

          <div className="flex-1 overflow-y-auto px-10 py-6">
            {regenerating ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-(--text-muted)">Regenerating with AI...</p>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your changelog entry..."
                className="w-full h-full min-h-[400px] bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted) resize-none focus:outline-none leading-relaxed font-mono"
              />
            )}
          </div>

          {entry.aiDraft && (
            <div className="mx-10 mb-6 bg-(--bg-raised) border border-(--border) rounded-xl overflow-hidden">
              <button
                onClick={() => setShowAiDraft((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap size={13} className="text-blue-400" />
                  <span className="font-medium">AI Draft</span>
                  <span className="text-[11px] text-(--text-muted)">
                    Generated from {entry.linkedPRs.length} PR{entry.linkedPRs.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <ChevronDown
                  size={13}
                  className={`text-(--text-muted) transition-transform ${showAiDraft ? 'rotate-180' : ''}`}
                />
              </button>
              {showAiDraft && (
                <div className="px-4 pb-4 border-t border-(--border)">
                  <pre className="text-xs text-(--text-muted) font-mono leading-relaxed whitespace-pre-wrap mt-3">
                    {entry.aiDraft}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <MetadataSidebar
          version={version}
          onVersionChange={setVersion}
          projects={projects}
          selectedProjectId={projectId}
          onProjectChange={setProjectId}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          notifySubscribers={notifySubscribers}
          onNotifyChange={setNotify}
          linkedPRIds={linkedPRIds}
          onOpenPRModal={() => setShowPRModal(true)}
          entry={{
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
            publishedAt: entry.publishedAt,
            linkedPRs: entry.linkedPRs,
          }}
          onDelete={handleDelete}
        />
      </div>

      {showPRModal && (
        <PRSelectModal
          projectId={projectId}
          onClose={() => setShowPRModal(false)}
          onGenerate={handleRegenerate}
          preSelectedIds={linkedPRIds}
        />
      )}
    </div>
  );
}