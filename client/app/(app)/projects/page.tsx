"use client";

import Topbar from '@/components/topbar';
import Link from 'next/link';
import {
  Plus, GitBranch, GitPullRequest,
  ScrollText, ExternalLink, MoreHorizontal,
  Star, Lock, Globe,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const PROJECTS = [
  {
    id: '1',
    name: 'my-saas-app',
    repoOwner: 'ajay-dev',
    repoName: 'my-saas-app',
    isPrivate: false,
    language: 'TypeScript',
    languageColor: '#3178c6',
    entries: 12,
    prsAvailable: 4,
    lastEntry: '2 days ago',
    description: 'Main SaaS product — Next.js frontend with NestJS backend.',
  },
  {
    id: '2',
    name: 'api-service',
    repoOwner: 'ajay-dev',
    repoName: 'api-service',
    isPrivate: true,
    language: 'TypeScript',
    languageColor: '#3178c6',
    entries: 6,
    prsAvailable: 8,
    lastEntry: '1 week ago',
    description: 'Internal REST API service used by all frontend apps.',
  },
  {
    id: '3',
    name: 'mobile-app',
    repoOwner: 'ajay-dev',
    repoName: 'mobile-app',
    isPrivate: false,
    language: 'Dart',
    languageColor: '#00B4AB',
    entries: 3,
    prsAvailable: 2,
    lastEntry: '3 weeks ago',
    description: 'Flutter mobile app for iOS and Android.',
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Projects" />

      <div className="flex-1 px-6 py-6 max-w-[1100px] space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-(--text-primary) tracking-tight">Projects</h1>
            <p className="text-(--text-muted) text-sm mt-0.5">
              {PROJECTS.length} connected repos
            </p>
          </div>
          <Link href="/projects/new">
            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={14} />
              Connect Repo
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {PROJECTS.map(project => (
            <div
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="group bg-(--bg-raised) border border-(--border) rounded-xl p-5 hover:border-(--text-muted) transition-all space-y-4"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-(--bg-overlay) border border-(--border) flex items-center justify-center">
                    <GitBranch size={16} className="text-(--text-muted)" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-(--text-primary) group-hover:text-blue-400 transition-colors">
                        {project.repoOwner}/{project.repoName}
                      </span>
                      {project.isPrivate ? (
                        <span className="flex items-center gap-0.5 text-[10px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded-full px-1.5 py-0.5">
                          <Lock size={9} /> Private
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] text-(--text-muted) bg-(--bg-overlay) border border-(--border) rounded-full px-1.5 py-0.5">
                          <Globe size={9} /> Public
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-(--text-muted) mt-0.5">{project.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={`https://github.com/${project.repoOwner}/${project.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={e => e.preventDefault()}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: ScrollText, label: 'Entries', value: project.entries },
                  { icon: GitPullRequest, label: 'PRs available', value: project.prsAvailable },
                  { icon: Star, label: 'Last entry', value: project.lastEntry },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-(--bg-overlay) border border-(--border) rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={11} className="text-(--text-muted)" />
                      <span className="text-[10px] text-(--text-muted)">{label}</span>
                    </div>
                    <p className="text-sm font-semibold text-(--text-primary)">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: project.languageColor }}
                  />
                  <span className="text-xs text-(--text-muted)">{project.language}</span>
                </div>

                {project.prsAvailable > 0 && (
                  <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                    {project.prsAvailable} PRs ready to generate
                  </span>
                )}
              </div>
            </div>
          ))}

          <button className="group border-2 border-dashed border-(--border) hover:border-blue-500/40 rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-all min-h-[180px]">
            <div className="w-10 h-10 rounded-xl bg-(--bg-raised) border border-(--border) group-hover:border-blue-500/30 group-hover:bg-blue-500/5 flex items-center justify-center transition-all">
              <Plus size={18} className="text-(--text-muted) group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary) transition-colors">
                Connect a repo
              </p>
              <p className="text-xs text-(--text-muted) mt-0.5">
                Import PRs and generate changelogs
              </p>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}