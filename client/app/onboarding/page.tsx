import { auth } from '@clerk/nextjs/server';
import { CreateOrganization } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default async function OnboardingPage() {
  const { userId, orgId } = await auth();

  if (orgId) redirect('/dashboard');

  if (!userId) redirect('/sign-in');

  return (
    <div className="min-h-screen bg-(--bg-base) flex flex-col">
      <header className="p-6 border-b border-(--border)">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-(--text-primary) fill-white" />
          </div>
          <span className="text-(--text-primary) font-semibold text-lg tracking-tight">Shiplog</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-(--text-primary) text-xs font-semibold">1</span>
            </div>
            <span className="text-(--text-secondary) text-sm">Account</span>
          </div>

          <div className="w-8 h-px bg-zinc-800" />

          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-blue-600/30">
              <span className="text-(--text-primary) text-xs font-semibold">2</span>
            </div>
            <span className="text-(--text-primary) text-sm font-medium">Workspace</span>
          </div>

          <div className="w-8 h-px bg-zinc-800" />

          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-(--text-muted) text-xs font-semibold">3</span>
            </div>
            <span className="text-(--text-muted) text-sm">GitHub</span>
          </div>
        </div>

        <div className="text-center mb-8 space-y-2">
          <h1 className="text-2xl font-bold text-(--text-primary) tracking-tight">
            Create your workspace
          </h1>
          <p className="text-(--text-secondary) text-sm max-w-xs">
            Your workspace is where you and your team manage changelogs. You can invite others later.
          </p>
        </div>

        <CreateOrganization
          afterCreateOrganizationUrl="/dashboard"
          skipInvitationScreen
        />

        <p className="mt-6 text-(--text-muted) text-xs text-center max-w-xs">
          The workspace name becomes your public changelog URL.{' '}
          <span className="text-(--text-muted)">e.g. acme-corp.shiplog.is-a.dev</span>
        </p>
      </main>
    </div>
  );
}