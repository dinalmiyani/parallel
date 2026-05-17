import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { apiServer } from '@/lib/api/server';
import GeneralSettingsClient from '@/components/settings/general/general-client';

interface OrgSettings {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  brandColor: string;
  domain: string | null;
  plan: string;
  createdAt: string;
  _count: { members: number };
}

export default async function GeneralSettingsPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const settings = await apiServer()
    .get<OrgSettings>('/settings')
    .catch(() => null);

  if (!settings) {
    return (
      <p className="text-sm text-(--text-muted)">Failed to load settings.</p>
    );
  }

  return <GeneralSettingsClient settings={settings} />;
}