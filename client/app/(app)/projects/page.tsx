import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { apiServer } from '@/lib/api/server';
import ProjectsClient from '@/components/projects/projects-client';

export interface Project {
  id: string;
  name: string;
  repoName: string;
  repoOwner: string;
  githubRepoId: number;
  defaultBranch: string;
  createdAt: string;
  entriesCount: number;
  unusedPRsCount: number;
  lastPublishedAt: string | null;
}

export default async function ProjectsPage() {

  const { userId, orgId} = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const projects = await apiServer()
    .get<Project[]>('/projects')
    .catch(() => [] as Project[]);

  return <ProjectsClient initialProjects={projects} />;
}