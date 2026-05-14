import ProjectDetailClient from '@/components/projectDetail/project-detail-client';
import { apiServer } from '@/lib/api/server';
import { EntryListItem, ProjectDetail, StoredPR } from '@/types/project';
import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const [project, prs, entries] = await Promise.all([
    apiServer()
      .get<ProjectDetail>(`/projects/${projectId}`)
      .catch(() => null),
    apiServer()
      .get<StoredPR[]>(`/github/prs/${projectId}`)
      .catch(() => [] as StoredPR[]),
    apiServer()
      .get<EntryListItem[]>(`/changelog?projectId=${projectId}`)
      .catch(() => [] as EntryListItem[]),
  ]);

  if (!project) notFound();

  return (
    <ProjectDetailClient
      project={project}
      initialPRs={prs}
      initialEntries={entries}
    />
  );
}