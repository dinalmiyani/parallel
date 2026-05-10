import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { clerkAppearance } from '@/lib/clerk-appearance';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: { default: 'Parallel', template: '%s — Parallel' },
  description: 'AI-powered changelog from your GitHub PRs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in" appearance={clerkAppearance}>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <ThemeProvider
            attribute="class" 
            defaultTheme="dark"
            enableSystem
          >
            {children}
            <Toaster theme="system" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider >
  );
}