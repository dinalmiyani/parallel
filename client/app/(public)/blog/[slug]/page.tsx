import Link from 'next/link';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

const POST = {
  title: 'How to write great release notes your users will actually read',
  tag: 'Guide',
  tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  date: 'January 15, 2026',
  readTime: '5 min read',
  content: [
    {
      type: 'p',
      text: 'Most release notes are written for developers by developers. They\'re full of technical jargon, PR numbers, and commit hashes that mean nothing to end users. Here\'s how to write ones that your actual users care about.',
    },
    { type: 'h2', text: '1. Write for your user, not your team' },
    {
      type: 'p',
      text: 'The most common mistake is writing changelogs in developer language. "Fixed a race condition in the WebSocket handler" tells your user nothing. "Fixed an issue where messages sometimes disappeared on slow connections" tells them exactly what changed and why it matters to them.',
    },
    { type: 'h2', text: '2. Lead with the benefit, not the feature' },
    {
      type: 'p',
      text: 'Instead of "Added bulk export functionality", write "Export all your data at once — no more downloading one file at a time." The feature is the export button. The benefit is saving time.',
    },
    { type: 'h2', text: '3. Group changes logically' },
    {
      type: 'p',
      text: 'Use clear categories: New features, Improvements, Bug fixes. Users scan release notes — they don\'t read every word. Make it easy to find what matters to them.',
    },
    { type: 'h2', text: '4. Keep it short' },
    {
      type: 'p',
      text: 'A good release note entry is 1–3 sentences. If you need more than that, link to documentation. Users want to know what changed, not a full technical brief.',
    },
    { type: 'h2', text: '5. Publish consistently' },
    {
      type: 'p',
      text: 'Inconsistent changelogs are worse than none. Users start ignoring them. Aim to publish on a regular cadence — weekly, bi-weekly, or after every significant release. Tools like Parallel make this effortless by automating the writing from your GitHub PRs.',
    },
  ],
};

export default function BlogPostPage() {
  return (
    <div className="bg-(--bg-base)">
      <article className="max-w-2xl mx-auto px-6 pt-28 pb-20">

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[11px] border rounded-full px-2.5 py-0.5 font-medium ${POST.tagColor}`}>
              {POST.tag}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-(--text-primary) leading-snug mb-4 tracking-tight">
            {POST.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-(--text-muted)">
            <span>{POST.date}</span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} /> {POST.readTime}
            </span>
          </div>
        </div>

        <div className="h-px bg-(--border) mb-8" />

        <div className="space-y-5">
          {POST.content.map((block, i) => {
            if (block.type === 'h2')
              return (
                <h2 key={i} className="text-lg font-bold text-(--text-primary) mt-8 mb-2 tracking-tight">
                  {block.text}
                </h2>
              );
            return (
              <p key={i} className="text-sm text-(--text-secondary) leading-relaxed">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="h-px bg-(--border) mt-12 mb-8" />

        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
          >
            <ArrowLeft size={14} /> All posts
          </Link>
          <Link
            href="/sign-up"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Try Parallel free →
          </Link>
        </div>

      </article>
    </div>
  );
}