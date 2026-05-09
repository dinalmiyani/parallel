'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Save, Zap, GitPullRequest,
  X, ChevronDown, Bold, Italic, List,
  ListOrdered, Code, Heading2, Minus, CornerDownLeft, Plus,
} from 'lucide-react';

const ALL_TAGS = ['Feature', 'Bug Fix', 'Improvement', 'Security', 'Performance', 'Breaking Change'];

const TAG_COLORS: Record<string, string> = {
  'Feature': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Bug Fix': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Improvement': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Performance': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Breaking Change': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Security': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const AVAILABLE_PRS = [
  { number: 247, title: 'feat: add webhook retry logic', merged: '3h ago' },
  { number: 246, title: 'fix: subscriber duplicate emails', merged: '1d ago' },
  { number: 245, title: 'chore: upgrade prisma to v5.10', merged: '2d ago' },
  { number: 244, title: 'feat: add analytics chart', merged: '3d ago' },
  { number: 243, title: 'fix: mobile sidebar overflow', merged: '4d ago' },
];

function ToolbarBtn({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button
      title={label}
      className="w-7 h-7 flex items-center justify-center rounded text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
    >
      <Icon size={14} />
    </button>
  );
}

export default function NewChangelogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showPRModal, setShowPRModal] = useState(false);
  const [selectedPRs, setSelectedPRs] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const togglePR = (num: number) =>
    setSelectedPRs(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setTitle('Webhook retry logic and email duplicate fix');
      setContent(`## What changed\n\nAdded automatic retry logic for failed webhooks and resolved duplicate email notifications for subscribers.\n\n## Webhook retry\n\nWebhooks now retry up to 3 times with exponential backoff when a delivery fails. Failed webhooks are logged and visible in your project settings.\n\n## Email fix\n\nSubscribers with multiple confirmed emails were receiving duplicate notifications. This is now resolved — each subscriber receives exactly one email per changelog entry.`);
      setSelectedTags(['Feature', 'Bug Fix']);
      setIsGenerating(false);
      setShowPRModal(false);
    }, 1500);
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
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPRModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 text-blue-400 text-sm font-medium rounded-lg transition-colors"
          >
            <Zap size={13} />
            Generate from PRs
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) text-sm rounded-lg transition-colors">
            <Save size={13} />
            Save draft
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            Publish
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 flex flex-col overflow-hidden border-r border-(--border)">

          <div className="px-10 pt-8 pb-4">
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What did you ship?"
              rows={2}
              className="w-full bg-transparent text-2xl font-bold text-(--text-primary) placeholder:text-(--text-muted) resize-none focus:outline-none leading-tight"
            />
          </div>

          <div className="flex items-center gap-0.5 px-10 py-2 border-y border-(--border) bg-(--bg-raised)">
            <ToolbarBtn icon={Bold} label="Bold" />
            <ToolbarBtn icon={Italic} label="Italic" />
            <ToolbarBtn icon={Heading2} label="Heading" />
            <div className="w-px h-4 bg-(--border) mx-1" />
            <ToolbarBtn icon={List} label="Bullet list" />
            <ToolbarBtn icon={ListOrdered} label="Numbered list" />
            <div className="w-px h-4 bg-(--border) mx-1" />
            <ToolbarBtn icon={Code} label="Code block" />
            <ToolbarBtn icon={Minus} label="Divider" />
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-(--text-muted)">AI is reading your PRs...</p>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Start writing your changelog...\n\nTip: Use "Generate from PRs" to let AI write this for you.`}
                className="w-full h-full min-h-[400px] bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted) resize-none focus:outline-none leading-relaxed font-mono"
              />
            )}
          </div>
        </div>

        <div className="w-[300px] flex-shrink-0 overflow-y-auto bg-(--bg-raised)">
          <div className="p-5 space-y-6">

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">Version</label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="e.g. v1.2.0"
                className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">Project</label>
              <button className="w-full flex items-center justify-between px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-secondary) hover:border-(--text-muted) transition-colors">
                <span>Select project...</span>
                <ChevronDown size={13} className="text-(--text-muted)" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map(tag => (
                  <span key={tag} className={`flex items-center gap-1 text-[11px] border rounded-full pl-2 pr-1 py-0.5 ${TAG_COLORS[tag]}`}>
                    {tag}
                    <button onClick={() => toggleTag(tag)} className="hover:opacity-70 transition-opacity">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setShowTagMenu(p => !p)}
                  className="text-[11px] border border-dashed border-(--border) rounded-full px-2 py-0.5 text-(--text-muted) hover:text-(--text-primary) hover:border-(--text-muted) transition-colors"
                >
                  + Add tag
                </button>
              </div>
              {showTagMenu && (
                <div className="bg-(--bg-overlay) border border-(--border) rounded-lg overflow-hidden">
                  {ALL_TAGS.filter(t => !selectedTags.includes(t)).map(tag => (
                    <button
                      key={tag}
                      onClick={() => { toggleTag(tag); setShowTagMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-(--text-secondary) hover:bg-(--bg-raised) hover:text-(--text-primary) transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${TAG_COLORS[tag]?.split(' ')[0]}`} />
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-(--border)" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-(--text-primary)">Notify subscribers</p>
                <p className="text-[11px] text-(--text-muted) mt-0.5">Send email on publish</p>
              </div>
              <button
                onClick={() => setNotifySubscribers(p => !p)}
                className={`relative w-9 h-5 rounded-full transition-colors ${notifySubscribers ? 'bg-blue-600' : 'bg-(--bg-overlay) border border-(--border)'
                  }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${notifySubscribers ? 'left-[18px]' : 'left-0.5'
                  }`} />
              </button>
            </div>

            <div className="h-px bg-(--border)" />

            <div className="space-y-2">
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">Linked PRs</label>
              {selectedPRs.length === 0 ? (
                <p className="text-xs text-(--text-muted) italic">No PRs linked yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {AVAILABLE_PRS.filter(p => selectedPRs.includes(p.number)).map(pr => (
                    <div key={pr.number} className="flex items-start gap-2 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) rounded-lg">
                      <GitPullRequest size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-mono text-(--text-muted)">#{pr.number}</p>
                        <p className="text-xs text-(--text-secondary) leading-snug truncate">{pr.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowPRModal(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-(--border) rounded-lg text-xs text-(--text-muted) hover:text-(--text-primary) hover:border-(--text-muted) transition-colors"
              >
                <CornerDownLeft size={11} />
                Link PRs
              </button>
            </div>

          </div>
        </div>
      </div>

      {showPRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-(--bg-raised) border border-(--border) rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-(--border)">
              <div>
                <h3 className="text-sm font-semibold text-(--text-primary)">Select Pull Requests</h3>
                <p className="text-xs text-(--text-muted) mt-0.5">Choose PRs to generate changelog from</p>
              </div>
              <button
                onClick={() => setShowPRModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="divide-y divide-(--border) max-h-72 overflow-y-auto">
              {AVAILABLE_PRS.map(pr => (
                <label
                  key={pr.number}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-(--bg-overlay) cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPRs.includes(pr.number)}
                    onChange={() => togglePR(pr.number)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <GitPullRequest size={11} className="text-emerald-500" />
                      <span className="font-mono text-[11px] text-(--text-muted)">#{pr.number}</span>
                      <span className="text-[11px] text-(--text-muted)">· {pr.merged}</span>
                    </div>
                    <p className="text-sm text-(--text-primary) leading-snug">{pr.title}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between px-5 py-4 border-t border-(--border)">
              <span className="text-xs text-(--text-muted)">
                {selectedPRs.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPRModal(false)}
                  className="px-3 py-1.5 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={selectedPRs.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Zap size={13} />
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}