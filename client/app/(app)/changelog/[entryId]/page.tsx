import ChangelogEditorClient from '@/components/changelog/changlog-editor';
import { apiServer } from '@/lib/api/server';
import { EntryDetail, Project } from '@/types/changlog';
import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation'; interface Props {
  params: Promise<{ entryId: string }>;
}

export default async function ChangelogEntryPage({ params }: Props) {
  const { entryId } = await params;
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const [entry, projects] = await Promise.all([
    apiServer()
      .get<EntryDetail>(`/changelog/${entryId}`)
      .catch(() => null),
    apiServer()
      .get<Project[]>('/projects')
      .catch(() => [] as Project[]),
  ]);

  if (!entry) notFound();

  return <ChangelogEditorClient entry={entry} projects={projects} />;
}