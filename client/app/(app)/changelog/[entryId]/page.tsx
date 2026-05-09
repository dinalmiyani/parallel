'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Save, Eye, MoreHorizontal, Zap,
  GitPullRequest, X, ChevronDown, Clock,
  Bold, Italic, List, ListOrdered, Code, Heading2,
  Minus, CornerDownLeft,
} from 'lucide-react';

const LINKED_PRS = [
  { number: 247, title: 'feat: add webhook retry logic' },
  { number: 246, title: 'fix: subscriber duplicate emails' },
];

const ALL_TAGS = ['Feature', 'Bug Fix', 'Improvement', 'Security', 'Performance', 'Breaking Change'];

const TAG_COLORS: Record<string, string> = {
  'Feature': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Bug Fix': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Improvement': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Performance': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Breaking Change': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Security': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

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

export default function ChangelogEditorPage() {
  const [title, setTitle] = useState('New subscriber email template');
  const [version, setVersion] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Feature']);
  const [isPublished, setIsPublished] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [content, setContent] = useState(
    `## What changed\n\nRedesigned the notification email sent to subscribers when a new changelog entry is published.\n\n## Why\n\nThe previous template was plain text and lacked branding. The new template includes your workspace logo, brand color, and a clean layout that looks great on mobile.\n\n## How to see it\n\nPublish any changelog entry — subscribers will receive the new template automatically.`
  );

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
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
            <div className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-(--text-muted)'}`} />
            {isPublished ? 'Published' : 'Draft'}
          </div>
          <span className="text-[11px] text-(--text-muted) flex items-center gap-1">
            <Clock size={10} />
            Saved 2 min ago
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-(--text-muted) hover:text-(--text-primary) text-sm rounded-lg hover:bg-(--bg-overlay) transition-colors">
            <Eye size={13} />
            Preview
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) text-sm rounded-lg transition-colors">
            <Save size={13} />
            Save draft
          </button>
          <button
            onClick={() => setIsPublished(p => !p)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 flex flex-col overflow-hidden border-r border-(--border)">

          <div className="px-10 pt-8 pb-4">
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Entry title..."
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
            <div className="w-px h-4 bg-(--border) mx-1" />
            <button className="flex items-center gap-1.5 px-2.5 py-1 ml-1 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 text-blue-400 text-xs font-medium rounded-md transition-colors">
              <Zap size={11} />
              Regenerate with AI
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-6">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your changelog entry... or use AI to generate from your PRs."
              className="w-full h-full min-h-[400px] bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted) resize-none focus:outline-none leading-relaxed font-mono"
            />
          </div>

          <div className="mx-10 mb-6 bg-(--bg-raised) border border-(--border) rounded-xl overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-blue-400" />
                <span className="font-medium">AI Draft</span>
                <span className="text-[11px] text-(--text-muted)">Generated from 2 PRs</span>
              </div>
              <ChevronDown size={13} className="text-(--text-muted)" />
            </button>
          </div>
        </div>

        <div className="w-[300px] flex-shrink-0 overflow-y-auto bg-(--bg-raised)">
          <div className="p-5 space-y-6">

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="e.g. v1.2.0"
                className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
                Project
              </label>
              <button className="w-full flex items-center justify-between px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-secondary) hover:border-(--text-muted) transition-colors">
                <span>my-saas-app</span>
                <ChevronDown size={13} className="text-(--text-muted)" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className={`flex items-center gap-1 text-[11px] border rounded-full pl-2 pr-1 py-0.5 ${TAG_COLORS[tag]}`}
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:opacity-70 transition-opacity"
                    >
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
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
                Linked PRs
              </label>
              <div className="space-y-1.5">
                {LINKED_PRS.map(pr => (
                  <div
                    key={pr.number}
                    className="flex items-start gap-2 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) rounded-lg"
                  >
                    <GitPullRequest size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-mono text-(--text-muted)">#{pr.number}</p>
                      <p className="text-xs text-(--text-secondary) leading-snug truncate">{pr.title}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-(--border) rounded-lg text-xs text-(--text-muted) hover:text-(--text-primary) hover:border-(--text-muted) transition-colors">
                  <CornerDownLeft size={11} />
                  Link more PRs
                </button>
              </div>
            </div>

            <div className="h-px bg-(--border)" />

            <div className="space-y-2 text-xs text-(--text-muted)">
              <div className="flex items-center justify-between">
                <span>Created</span>
                <span className="text-(--text-secondary)">Jan 15, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last edited</span>
                <span className="text-(--text-secondary)">2 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Published</span>
                <span className="text-(--text-secondary)">—</span>
              </div>
            </div>

            <div className="h-px bg-(--border)" />

            <button className="w-full text-xs text-red-400 hover:text-red-300 transition-colors py-1">
              Delete entry
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}