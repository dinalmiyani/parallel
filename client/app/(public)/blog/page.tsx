import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

const POSTS = [
  {
    slug: 'how-to-write-great-release-notes',
    title: 'How to write great release notes your users will actually read',
    excerpt: 'Most release notes are written for developers by developers. Here\'s how to write ones that your actual users care about.',
    tag: 'Guide',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    date: 'January 15, 2026',
    readTime: '5 min read',
    featured: true,
  },
  {
    slug: '5-changelog-tools-compared',
    title: '5 changelog tools compared in 2026 — which is right for you?',
    excerpt: 'We compared Beamer, Headway, Canny, LaunchNotes, and Parallel. Here\'s the honest breakdown.',
    tag: 'Comparison',
    tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    date: 'January 8, 2026',
    readTime: '8 min read',
    featured: false,
  },
  {
    slug: 'why-developers-skip-changelogs',
    title: 'Why developers skip changelogs (and how to fix it)',
    excerpt: 'The real reason most products have terrible changelogs isn\'t laziness — it\'s friction. Here\'s how to eliminate it.',
    tag: 'Opinion',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    date: 'December 28, 2025',
    readTime: '4 min read',
    featured: false,
  },
  {
    slug: 'using-ai-for-documentation',
    title: 'Using AI for developer documentation — what works and what doesn\'t',
    excerpt: 'AI is great at summarizing technical content, but it falls short in specific places. Here\'s what we learned building Parallel.',
    tag: 'Engineering',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    date: 'December 20, 2025',
    readTime: '6 min read',
    featured: false,
  },
];

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="bg-(--bg-base)">

      <section className="pt-28 pb-12 px-6 text-center">
        <p className="text-blue-400 text-sm font-medium mb-3">Blog</p>
        <h1 className="text-4xl font-bold text-(--text-primary) tracking-tight mb-4">
          Thoughts on shipping software.
        </h1>
        <p className="text-(--text-muted) text-sm">
          Guides, comparisons, and opinions from the Parallel team.
        </p>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-5">

          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-(--bg-raised) border border-(--border) rounded-2xl p-7 hover:border-(--text-muted) transition-all"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[11px] border rounded-full px-2.5 py-0.5 font-medium ${featured.tagColor}`}>
                {featured.tag}
              </span>
              <span className="text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5 font-medium">
                Featured
              </span>
            </div>
            <h2 className="text-xl font-bold text-(--text-primary) mb-3 leading-snug group-hover:text-blue-400 transition-colors">
              {featured.title}
            </h2>
            <p className="text-sm text-(--text-muted) leading-relaxed mb-5">
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-(--text-muted)">
                <span>{featured.date}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {featured.readTime}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-blue-400 group-hover:gap-2 transition-all">
                Read more <ArrowRight size={12} />
              </span>
            </div>
          </Link>

          {rest.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-5 bg-(--bg-raised) border border-(--border) rounded-2xl p-5 hover:border-(--text-muted) transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] border rounded-full px-2 py-0.5 ${post.tagColor}`}>
                    {post.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-(--text-primary) mb-2 leading-snug group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-(--text-muted) leading-relaxed mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-(--text-muted)">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {post.readTime}
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-(--text-muted) flex-shrink-0 mt-1 group-hover:text-blue-400 transition-colors" />
            </Link>
          ))}

        </div>
      </section>
    </div>
  );
}