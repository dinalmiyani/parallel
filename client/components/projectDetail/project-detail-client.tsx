'use client';

import { useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/topbar';
import { ExternalLink, Globe } from 'lucide-react';
import { EntryListItem, ProjectDetail, StoredPR } from '@/types/project';
import PRsTab from './prs-tab';
import EntriesTab from './entries-tab';
import ProjectSettingsTab from './setting-tab';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Dart: '#00B4AB',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C#': '#178600',
  Ruby: '#701516',
  Swift: '#F05138',
};

const TABS = ['Pull Requests', 'Changelog Entries', 'Settings'] as const;
type Tab = typeof TABS[number];

interface Props {
  project: ProjectDetail;
  initialPRs: StoredPR[];
  initialEntries: EntryListItem[];
}

export default function ProjectDetailClient({
  project,
  initialPRs,
  initialEntries,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Pull Requests');

  const unusedCount = initialPRs.filter((pr) => !pr.used).length;

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar
        title={project.name}
        breadcrumb={[
          { label: 'Projects', href: '/projects' },
          { label: `${project.repoOwner}/${project.repoName}` },
        ]}
      />

      <div className="flex-1 px-6 py-6 max-w-[1100px] space-y-5">

        <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Link
                href="/projects"
                className="mt-0.5 text-(--text-muted) hover:text-(--text-primary) transition-colors text-sm"
              >
                ← Back
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg font-semibold text-(--text-primary)">
                    {project.repoOwner}/{project.repoName}
                  </h1>
                  <a
                    href={`https://github.com/${project.repoOwner}/${project.repoName}`}
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
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LANG_COLORS['TypeScript'] ?? '#6b7280' }}
                    />
                    TypeScript
                  </span>
                  <span>Branch: {project.defaultBranch}</span>
                  <span>{project.entriesCount} entries</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-(--border)">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab
                  ? 'text-blue-400 border-blue-500'
                  : 'text-(--text-muted) border-transparent hover:text-(--text-primary)'
                }`}
            >
              {tab}
              {tab === 'Pull Requests' && unusedCount > 0 && (
                <span className="ml-1.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-1.5 py-0.5">
                  {unusedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Pull Requests' && (
          <PRsTab
            projectId={project.id}
            initialPRs={initialPRs}
          />
        )}

        {activeTab === 'Changelog Entries' && (
          <EntriesTab entries={initialEntries} />
        )}

        {activeTab === 'Settings' && (
          <ProjectSettingsTab project={project} />
        )}

      </div>
    </div>
  );
}