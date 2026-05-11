export default function PrivacyPage() {
  return (
    <div className="bg-(--bg-base)">
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-(--text-muted) mb-10">Last updated: January 15, 2026</p>

        {[
          {
            title: 'What we collect',
            body: 'We collect your email address, name, and GitHub OAuth token when you sign up. We read PR titles and descriptions from your GitHub repos to generate changelog content. We never read your actual code.',
          },
          {
            title: 'How we use it',
            body: 'Your data is used to operate Parallel — storing your changelog entries, sending subscriber emails, and generating AI content. We do not sell your data or use it for advertising.',
          },
          {
            title: 'GitHub data',
            body: 'We request read-only access to your repositories via GitHub OAuth. We only store PR numbers, titles, and descriptions. We do not store your source code, secrets, or any other repository content.',
          },
          {
            title: 'Subscriber emails',
            body: 'Email addresses collected through your public changelog subscribe form are stored securely and only used to send notifications for your workspace. Subscribers can unsubscribe at any time via the link in every email.',
          },
          {
            title: 'Data retention',
            body: 'Your data is retained while your account is active. If you delete your workspace, all associated data is permanently deleted within 30 days. You can request immediate deletion by contacting us.',
          },
          {
            title: 'Contact',
            body: 'Questions? Email us at privacy@parallel.dev. We respond to all privacy requests within 48 hours.',
          },
        ].map(({ title, body }) => (
          <div key={title} className="mb-8">
            <h2 className="text-base font-semibold text-(--text-primary) mb-2">{title}</h2>
            <p className="text-sm text-(--text-muted) leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}