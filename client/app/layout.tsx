"use client";

import {
  ClerkProvider,
  SignInButton,
  UserButton,
  OrganizationSwitcher,
  useAuth
} from '@clerk/nextjs';
import './globals.css';

function HeaderContent() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) return <div className="h-10" />;

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-indigo-600">IssueTracker</h1>

        {userId && (
          <div className="border-l pl-4">
            <OrganizationSwitcher hidePersonal={false} />
          </div>
        )}
      </div>

      <div>
        {!userId ? (
          <SignInButton mode="modal">
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">
              Sign In
            </button>
          </SignInButton>
        ) : (
          <UserButton />
        )}
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex h-screen flex-col bg-slate-50">
          <HeaderContent />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
