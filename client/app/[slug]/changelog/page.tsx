import { notFound } from 'next/navigation';
import { Zap, Rss } from 'lucide-react';
import SubscribeForm from './subscribe-form';

export const revalidate = 60;
interface PublicEntry {
  id: string;
  title: string;
  version: string | null;
  tags: string[];
  content: string;
  publishedAt: string;
}

interface PublicChangelogData {
  workspace: {
    name: string;
    logo: string | null;
    brandColor: string;
  };
  entries: PublicEntry[];
}

const TAG_COLORS: Record<string, string> = {
  FEATURE: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  BUG_FIX: 'bg-red-500/10 text-red-500 border-red-500/20',
  IMPROVEMENT: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  PERFORMANCE: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  BREAKING_CHANGE: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  SECURITY: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

function formatTag(tag: string): string {
  return tag.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}

function ContentRenderer({ content }: { content: string }) {
  const lines = content.trim().split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (line.startsWith('## '))
          return (
            <h3
              key={i}
              className="text-base font-semibold text-gray-900 dark:text-white mt-5 mb-1 first:mt-0"
            >
              {line.slice(3)}
            </h3>
          );

        if (line.startsWith('- '))
          return (
            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 ml-4 list-disc leading-relaxed">
              {line.slice(2)}
            </li>
          );

        if (line === '')
          return <div key={i} className="h-1" />;

        return (
          <p key={i} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicChangelogPage({ params }: Props) {
  const { slug } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

  const res = await fetch(`${apiUrl}/public/changelog/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) notFound();

  const data = (await res.json()) as PublicChangelogData;
  const { workspace, entries } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">

      <header className="border-b border-gray-200 dark:border-zinc-900 bg-white dark:bg-[#111118]">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {workspace.logo ? (
              <img
                src={workspace.logo}
                alt={workspace.name}
                className="w-9 h-9 rounded-xl object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: workspace.brandColor }}
              >
                {workspace.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                {workspace.name}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Changelog</p>
            </div>
          </div>

          <a
            href="#subscribe"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: workspace.brandColor }}
          >
            <Rss size={13} />
            Subscribe
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">

        {entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 dark:text-gray-600 text-sm">
              No changelog entries published yet.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {entries.map((entry, i) => (
              <article key={entry.id} className="relative">
                <div className="flex gap-6">

                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 ring-4 ring-gray-50 dark:ring-[#0a0a0f]"
                      style={{ backgroundColor: workspace.brandColor }}
                    />
                    {i < entries.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 dark:bg-zinc-800 mt-2" />
                    )}
                  </div>

                  <div className="flex-1 pb-10">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(entry.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      {entry.version && (
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded px-1.5 py-0.5">
                          {entry.version}
                        </span>
                      )}
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[11px] border rounded-full px-2 py-0.5 ${TAG_COLORS[tag] ?? 'text-gray-500 bg-gray-100 border-gray-200'}`}
                        >
                          {formatTag(tag)}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 leading-snug">
                      {entry.title}
                    </h2>

                    <ContentRenderer content={entry.content} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div id="subscribe" className="mt-8 border-t border-gray-200 dark:border-zinc-900 pt-10">
          <div className="bg-white dark:bg-[#111118] border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: `${workspace.brandColor}20` }}
            >
              <Rss size={18} style={{ color: workspace.brandColor }} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Stay in the loop
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Get notified when {workspace.name} ships something new.
            </p>

            <SubscribeForm slug={slug} brandColor={workspace.brandColor} />
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <Zap size={11} />
            Powered by Parallel
          </a>
        </div>
      </main>
    </div>
  );
}