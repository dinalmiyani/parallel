'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/topbar';
import { Plus } from 'lucide-react';
import ConnectRepoModal from './connect-repo-modal';
import { Project } from '@/types/project';
import ProjectCard from './project-card';
import EmptyState from './empty-state';
import DisconnectModal from './disconnect-modal';

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showConnect, setShowConnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState<Project | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleConnected = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const handleDisconnected = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Projects" />

      <div className="flex-1 px-6 py-6 max-w-[1100px] space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-(--text-primary) tracking-tight">
              Projects
            </h1>
            <p className="text-(--text-muted) text-sm mt-0.5">
              {projects.length} connected repo{projects.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => setShowConnect(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={14} />
            Connect Repo
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onDisconnect={setDisconnecting}
              onOpen={() => router.push(`/projects/${project.id}`)}
            />
          ))}

          <button
            onClick={() => setShowConnect(true)}
            className="group border-2 border-dashed border-(--border) hover:border-blue-500/40 rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-all min-h-[180px]"
          >
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

          {projects.length === 0 && (
            <EmptyState onConnect={() => setShowConnect(true)} />
          )}
        </div>
      </div>

      {showConnect && (
        <ConnectRepoModal
          onClose={() => setShowConnect(false)}
          onConnected={handleConnected}
        />
      )}

      {disconnecting && (
        <DisconnectModal
          project={disconnecting}
          onClose={() => setDisconnecting(null)}
          onDisconnected={handleDisconnected}
        />
      )}

      {openMenu && (
        <div
          className="fixed inset-0 z-[5]"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpenMenu(null);
          }}
        />
      )}
    </div>
  );
}