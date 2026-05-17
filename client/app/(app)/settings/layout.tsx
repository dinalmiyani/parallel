import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Topbar from '@/components/topbar';
import SettingsSidebarNav from './setting-sidebar-nav';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-base)">
      <Topbar title="Settings" />

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-[220px] flex-shrink-0 border-r border-(--border) bg-(--bg-raised) overflow-y-auto">
          <div className="p-4">
            <p className="text-[11px] font-semibold text-(--text-muted) uppercase tracking-wider mb-2 px-2">
              Settings
            </p>
            <SettingsSidebarNav />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>

      </div>
    </div>
  );
}