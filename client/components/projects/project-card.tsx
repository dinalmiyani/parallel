'use client';

import { Project } from '@/types/project';
import {
  ExternalLink,
  GitBranch,
  GitPullRequest,
  MoreHorizontal,
  ScrollText,
} from 'lucide-react';

export default function ProjectCard({
  project,
  openMenu,
  setOpenMenu,
  onDisconnect,
  onOpen,
}: {
  project: Project;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onDisconnect: (project: Project) => void;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className="group bg-(--bg-raised) border border-(--border) rounded-xl p-5 hover:border-(--text-muted) transition-all space-y-4 cursor-pointer"
    >

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-(--bg-overlay) border border-(--border) flex items-center justify-center">
            <GitBranch
              size={16}
              className="text-(--text-muted)"
            />
          </div>

          <div>
            <span className="text-sm font-semibold text-(--text-primary) group-hover:text-blue-400 transition-colors">
              {project.repoOwner}/{project.repoName}
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >

          <a
            href={`https://github.com/${project.repoOwner}/${project.repoName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
          >
            <ExternalLink size={12} />
          </a>

          <div className="relative">

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(
                  openMenu === project.id
                    ? null
                    : project.id,
                )}
              }
              className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
            >
              <MoreHorizontal size={13} />
            </button>

            {openMenu === project.id && (
              <div className="absolute right-0 top-8 bg-(--bg-raised) border border-(--border) rounded-lg shadow-xl z-10 w-40 overflow-hidden">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-(--text-secondary) hover:bg-(--bg-overlay) hover:text-(--text-primary) transition-colors"
                >
                  View details
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(null);
                    onDisconnect(project);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Disconnect repo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">

        {[
          {
            icon: ScrollText,
            label: 'Entries',
            value: project.entriesCount,
          },
          {
            icon: GitPullRequest,
            label: 'PRs available',
            value: project.unusedPRsCount,
          },
          {
            icon: GitBranch,
            label: 'Branch',
            value: project.defaultBranch,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-(--bg-overlay) border border-(--border) rounded-lg px-3 py-2.5"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon
                size={11}
                className="text-(--text-muted)"
              />

              <span className="text-[10px] text-(--text-muted)">
                {label}
              </span>
            </div>

            <p className="text-sm font-semibold text-(--text-primary) truncate">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">

        <span className="text-xs text-(--text-muted)">
          {project.lastPublishedAt
            ? `Last published ${new Date(
                project.lastPublishedAt,
              ).toLocaleDateString()}`
            : 'No entries yet'}
        </span>

        {project.unusedPRsCount > 0 && (
          <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
            {project.unusedPRsCount} PRs ready
          </span>
        )}
      </div>
    </div>
  );
}