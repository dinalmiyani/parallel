'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Save, Zap, Loader2 } from 'lucide-react';
import { useApi } from '@/lib/api/client';
import { AiDraftSession, Project } from '@/types/changlog';
import EditorToolbar from '@/components/changelog/editor-toolbar';
import MetadataSidebar from '@/components/changelog/metadata-sidebar';
import PRSelectModal from '@/components/changelog/pr-model';

export default function NewChangelogPage() {
  const api = useApi();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProjectId, setProjectId] = useState('');
  const [notifySubscribers, setNotify] = useState(true);
  const [linkedPRIds, setLinkedPRIds] = useState<string[]>([]);
  const [aiDraft, setAiDraft] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPRModal, setShowPRModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('ai_draft');
    if (raw) {
      try {
        const draft = JSON.parse(raw) as AiDraftSession;
        setTitle(draft.title);
        setContent(draft.content);
        setSelectedTags(draft.suggestedTags);
        setProjectId(draft.projectId);
        setLinkedPRIds(draft.prIds);
        setAiDraft(draft.aiDraft);
        sessionStorage.removeItem('ai_draft');
        toast.success('AI draft loaded');
      } catch {
      }
    }
  }, []);

  useEffect(() => {
    api.get<Project[]>('/projects').then(setProjects).catch(() => { });
  }, []);

  useEffect(() => {
    if (!title && !content) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => handleSave(false), 30_000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [title, content, version, selectedTags]);

  const handleSave = async (showToast = true) => {
    if (!title.trim()) {
      if (showToast) toast.error('Title is required');
      return;
    }
    if (!selectedProjectId) {
      if (showToast) toast.error('Please select a project');
      return;
    }

    setSaving(true);
    try {
      await api.post('/changelog', {
        title,
        content,
        version: version || undefined,
        tags: selectedTags,
        projectId: selectedProjectId,
        isPublished: false,
        aiDraft: aiDraft || undefined,
        prIds: linkedPRIds,
      });
      setLastSaved(new Date());
      if (showToast) toast.success('Draft saved');
    } catch (err) {
      if (showToast) toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!selectedProjectId) { toast.error('Please select a project'); return; }
    if (!content.trim()) { toast.error('Content is required'); return; }

    setPublishing(true);
    try {
      const entry = await api.post<{ id: string }>('/changelog', {
        title,
        content,
        version: version || undefined,
        tags: selectedTags,
        projectId: selectedProjectId,
        isPublished: true,
        aiDraft: aiDraft || undefined,
        prIds: linkedPRIds,
      });
      toast.success('Entry published!');
      router.push(`/changelog/${entry.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleGenerate = async (prIds: string[]) => {
    if (!selectedProjectId) { toast.error('Select a project first'); return; }
    setIsGenerating(true);
    setShowPRModal(false);
    try {
      const result = await api.post<{
        title: string;
        content: string;
        suggestedTags: string[];
        aiDraft: string;
      }>('/ai/generate', { projectId: selectedProjectId, prIds });

      setTitle(result.title);
      setContent(result.content);
      setSelectedTags(result.suggestedTags);
      setLinkedPRIds(prIds);
      setAiDraft(result.aiDraft);
      toast.success('AI draft generated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setIsGenerating(false);
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
          <span className="text-sm font-medium text-(--text-secondary)">New entry</span>
          <span className="text-[11px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded-full px-2 py-0.5">
            Draft
          </span>
          {lastSaved && (
            <span className="text-[11px] text-(--text-muted)">
              Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPRModal(true)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 disabled:opacity-50 text-blue-400 text-sm font-medium rounded-lg transition-colors"
          >
            {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
            {isGenerating ? 'Generating...' : 'Generate from PRs'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) disabled:opacity-50 text-(--text-secondary) text-sm rounded-lg transition-colors"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? 'Saving...' : 'Save draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {publishing && <Loader2 size={13} className="animate-spin" />}
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 flex flex-col overflow-hidden border-r border-(--border)">

          <div className="px-10 pt-8 pb-4">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What did you ship?"
              rows={2}
              className="w-full bg-transparent text-2xl font-bold text-(--text-primary) placeholder:text-(--text-muted) resize-none focus:outline-none leading-tight"
            />
          </div>

          <EditorToolbar showAiButton={false} />

          <div className="flex-1 overflow-y-auto px-10 py-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-(--text-muted)">AI is reading your PRs...</p>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Start writing your changelog...\n\nTip: Use "Generate from PRs" to let AI write this for you.`}
                className="w-full h-full min-h-[400px] bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted) resize-none focus:outline-none leading-relaxed font-mono"
              />
            )}
          </div>
        </div>

        <MetadataSidebar
          version={version}
          onVersionChange={setVersion}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectChange={setProjectId}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          notifySubscribers={notifySubscribers}
          onNotifyChange={setNotify}
          linkedPRIds={linkedPRIds}
          onOpenPRModal={() => setShowPRModal(true)}
          entry={null}
        />
      </div>

      {showPRModal && selectedProjectId && (
        <PRSelectModal
          projectId={selectedProjectId}
          onClose={() => setShowPRModal(false)}
          onGenerate={handleGenerate}
          preSelectedIds={linkedPRIds}
        />
      )}

      {showPRModal && !selectedProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-(--bg-raised) border border-(--border) rounded-2xl p-6 max-w-sm mx-4 text-center">
            <p className="text-sm text-(--text-primary) font-medium mb-2">Select a project first</p>
            <p className="text-xs text-(--text-muted) mb-4">Choose a project from the right panel before generating from PRs.</p>
            <button onClick={() => setShowPRModal(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}