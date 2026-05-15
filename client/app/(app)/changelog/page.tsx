import ChangelogClient from '@/components/changelog/changelog-client';
import { apiServer } from '@/lib/api/server';
import { EntryListItem } from '@/types/changlog';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ChangelogPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const entries = await apiServer()
    .get<EntryListItem[]>('/changelog')
    .catch(() => [] as EntryListItem[]);

  return <ChangelogClient initialEntries={entries} />;
}