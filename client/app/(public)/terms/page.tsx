export default function TermsPage() {
  return (
    <div className="bg-(--bg-base)">
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2 tracking-tight">Terms of Service</h1>
        <p className="text-sm text-(--text-muted) mb-10">Last updated: January 15, 2026</p>

        {[
          {
            title: '1. Acceptance',
            body: 'By using Parallel, you agree to these terms. If you don\'t agree, please don\'t use the service. These terms apply to all users, including free and paid plan users.',
          },
          {
            title: '2. Use of service',
            body: 'Parallel is provided for generating and publishing software changelogs. You may not use Parallel for spam, illegal activity, or any purpose that violates GitHub\'s terms of service. You are responsible for all content published through your account.',
          },
          {
            title: '3. GitHub integration',
            body: 'By connecting your GitHub account, you authorize Parallel to read repository data including pull requests and commit messages. You can revoke this access at any time from your GitHub OAuth settings.',
          },
          {
            title: '4. Subscriber data',
            body: 'Email subscribers who sign up through your public changelog page are your responsibility. You agree to only send relevant changelog updates and to honor all unsubscribe requests promptly.',
          },
          {
            title: '5. Free and paid plans',
            body: 'The free plan is available at no charge and may have usage limits. Paid plans are billed monthly. You may cancel at any time. Refunds are not provided for partial months.',
          },
          {
            title: '6. Termination',
            body: 'We reserve the right to terminate accounts that violate these terms, engage in abuse, or use the service in a way that harms other users. You may delete your account at any time from Settings.',
          },
          {
            title: '7. Limitation of liability',
            body: 'Parallel is provided "as is". We are not liable for any data loss, service interruptions, or damages arising from use of the service. Maximum liability is limited to the amount you paid in the last 3 months.',
          },
          {
            title: '8. Contact',
            body: 'Questions about these terms? Email legal@parallel.dev.',
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