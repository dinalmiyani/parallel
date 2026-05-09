import Sidebar from '@/components/sidebar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId, orgId } = await auth();

  if (!userId) redirect('/sign-in');
  if (!orgId) redirect('/onboarding');

  return (
    <div className="min-h-screen bg-(--bg-base) flex">
      <Sidebar />

      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}