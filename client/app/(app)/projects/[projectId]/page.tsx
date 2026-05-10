'use client';

import { useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/topbar';
import {
  ArrowLeft, GitPullRequest, ScrollText, Settings,
  ExternalLink, Globe, RefreshCw, Zap, MoreHorizontal,
  Clock, CheckCircle2, Circle,
} from 'lucide-react';

const PROJECT = {
  id: '1',
  name: 'my-saas-app',
  repoOwner: 'ajay-dev',
  repoName: 'my-saas-app',
  language: 'TypeScript',
  languageColor: '#3178c6',
  defaultBranch: 'main',
};

const PULL_REQUESTS = [
  { number: 247, title: 'feat: add webhook retry logic', author: 'ajay-dev', merged: '3h ago', used: false },
  { number: 246, title: 'fix: subscriber duplicate emails', author: 'ajay-dev', merged: '1d ago', used: false },
  { number: 245, title: 'chore: upgrade prisma to v5.10', author: 'ajay-dev', merged: '2d ago', used: false },
  { number: 244, title: 'feat: add analytics chart', author: 'ajay-dev', merged: '3d ago', used: false },
  { number: 243, title: 'fix: mobile sidebar overflow', author: 'ajay-dev', merged: '4d ago', used: true },
  { number: 242, title: 'feat: dark mode toggle', author: 'ajay-dev', merged: '5d ago', used: true },
  { number: 241, title: 'chore: update dependencies', author: 'ajay-dev', merged: '1w ago', used: true },
];

const ENTRIES = [
  { id: '1', title: 'Redesigned dashboard with real-time metrics', version: 'v2.4.0', status: 'published', date: 'Jan 15, 2026', tags: ['Feature'] },
  { id: '2', title: 'Fixed GitHub sync edge case on private repos', version: 'v2.3.1', status: 'published', date: 'Jan 10, 2026', tags: ['Bug Fix'] },
  { id: '3', title: 'Added keyboard shortcuts for power users', version: 'v2.2.0', status: 'published', date: 'Dec 28, 2025', tags: ['Feature'] },
];

const TAG_COLORS: Record<string, string> = {
  'Feature': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Bug Fix': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const TABS = ['Pull Requests', 'Changelog Entries', 'Settings'];

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState('Pull Requests');
  const [selectedPRs, setSelectedPRs] = useState<number[]>([]);

  const togglePR = (num: number) =>
    setSelectedPRs(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]);

  const unusedPRs = PULL_REQUESTS.filter(pr => !pr.used);

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar
        title={PROJECT.name}
        breadcrumb={[
          { label: 'Projects', href: '/projects' },
          { label: `${PROJECT.repoOwner}/${PROJECT.repoName}` },
        ]}
      />

      <div className="flex-1 px-6 py-6 max-w-[1100px] space-y-5">

        <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Link href="/projects" className="mt-0.5 text-(--text-muted) hover:text-(--text-primary) transition-colors">
                <ArrowLeft size={16} />
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg font-semibold text-(--text-primary)">
                    {PROJECT.repoOwner}/{PROJECT.repoName}
                  </h1>
                  <a
                    href={`https://github.com/${PROJECT.repoOwner}/${PROJECT.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--text-muted) hover:text-(--text-primary) transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
                <div className="flex items-center gap-3 text-xs text-(--text-muted)">
                  <span className="flex items-center gap-1">
                    <Globe size={11} /> Public
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PROJECT.languageColor }} />
                    {PROJECT.language}
                  </span>
                  <span>Branch: {PROJECT.defaultBranch}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-secondary) text-sm rounded-lg transition-colors">
                <RefreshCw size={12} />
                Import PRs
              </button>
              {selectedPRs.length > 0 && (
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                  <Zap size={13} />
                  Generate from {selectedPRs.length} PR{selectedPRs.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-(--border)">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab
                  ? 'text-blue-400 border-blue-500'
                  : 'text-(--text-muted) border-transparent hover:text-(--text-primary)'
                }`}
            >
              {tab}
              {tab === 'Pull Requests' && unusedPRs.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-1.5 py-0.5">
                  {unusedPRs.length}
                </span>
              )}
            </button>
          ))}
        </div>


        {activeTab === 'Pull Requests' && (
          <div className="space-y-2">
            {unusedPRs.length > 0 && (
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 text-xs text-(--text-muted) cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={selectedPRs.length === unusedPRs.length}
                    onChange={() =>
                      setSelectedPRs(
                        selectedPRs.length === unusedPRs.length
                          ? []
                          : unusedPRs.map(p => p.number)
                      )
                    }
                  />
                  Select all unused ({unusedPRs.length})
                </label>
              </div>
            )}

            {PULL_REQUESTS.map(pr => (
              <div
                key={pr.number}
                className={`flex items-start gap-3 px-4 py-3.5 bg-(--bg-raised) border rounded-xl transition-all ${pr.used
                    ? 'border-(--border) opacity-50'
                    : selectedPRs.includes(pr.number)
                      ? 'border-blue-500/40 bg-blue-500/5'
                      : 'border-(--border) hover:border-(--text-muted)'
                  }`}
              >
                {!pr.used && (
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-blue-600 flex-shrink-0"
                    checked={selectedPRs.includes(pr.number)}
                    onChange={() => togglePR(pr.number)}
                  />
                )}
                {pr.used && (
                  <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                )}
                {!pr.used && !selectedPRs.includes(pr.number) && (
                  <></>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <GitPullRequest size={12} className="text-emerald-500" />
                    <span className="font-mono text-[11px] text-(--text-muted)">#{pr.number}</span>
                    {pr.used && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-1.5 py-0.5">
                        Used
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-(--text-primary) font-medium">{pr.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-(--text-muted)">
                    <Clock size={10} />
                    Merged {pr.merged} by {pr.author}
                  </div>
                </div>

                {!pr.used && (
                  <button className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-(--bg-overlay) border border-(--border) hover:border-(--text-muted) text-(--text-muted) hover:text-(--text-primary) text-xs rounded-lg transition-colors">
                    <Zap size={11} />
                    Use
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Changelog Entries' && (
          <div className="space-y-2">
            {ENTRIES.map(entry => (
              <Link
                key={entry.id}
                href={`/changelog/${entry.id}`}
                className="flex items-center gap-4 px-4 py-3.5 bg-(--bg-raised) border border-(--border) rounded-xl hover:border-(--text-muted) transition-all group"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.status === 'published' ? 'bg-emerald-400' : 'bg-(--text-muted)'
                  }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.version && (
                      <span className="font-mono text-[11px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded px-1.5 py-0.5">
                        {entry.version}
                      </span>
                    )}
                    {entry.tags.map(tag => (
                      <span key={tag} className={`text-[10px] border rounded-full px-2 py-0.5 ${TAG_COLORS[tag] ?? ''}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-(--text-primary) group-hover:text-blue-400 transition-colors">
                    {entry.title}
                  </p>
                </div>
                <span className="text-xs text-(--text-muted) flex-shrink-0">{entry.date}</span>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="max-w-lg space-y-6">
            <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-(--text-primary)">Project Settings</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-(--text-muted)">Display name</label>
                <input
                  defaultValue="my-saas-app"
                  className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-(--text-muted)">Default branch</label>
                <input
                  defaultValue="main"
                  className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                Save changes
              </button>
            </div>

            <div className="bg-(--bg-raised) border border-red-500/20 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-(--text-primary)">Disconnect repository</p>
                  <p className="text-xs text-(--text-muted) mt-0.5">Removes this repo and all its PR data. Entries are kept.</p>
                </div>
                <button className="px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm rounded-lg transition-colors">
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}