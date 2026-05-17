import BillingClient from '@/components/settings/billing/billing-client';
import { apiServer } from '@/lib/api/server';
import { UsageData } from '@/types/uses-data';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function BillingSettingsPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const usage = await apiServer()
    .get<UsageData>('/subscription/usage')
    .catch(() => null);

  if (!usage) {
    return <p className="text-sm text-(--text-muted)">Failed to load billing data.</p>;
  }

  return <BillingClient usage={usage} />;
}