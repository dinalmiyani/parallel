import BrandingClient from '@/components/settings/branding/branding-client';
import { apiServer } from '@/lib/api/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface OrgSettings {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  brandColor: string;
  domain: string | null;
  plan: string;
}

export default async function BrandingSettingsPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const settings = await apiServer()
    .get<OrgSettings>('/settings')
    .catch(() => null);

  if (!settings) {
    return <p className="text-sm text-(--text-muted)">Failed to load settings.</p>;
  }

  return <BrandingClient settings={settings} />;
}