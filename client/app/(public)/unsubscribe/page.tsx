interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-(--bg-base) flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-lg font-semibold text-(--text-primary) mb-2">Invalid link</h1>
          <p className="text-sm text-(--text-muted)">This unsubscribe link is missing a token.</p>
        </div>
      </div>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
  let success = false;
  let message = '';

  try {
    const res = await fetch(`${apiUrl}/public/unsubscribe?token=${token}`);
    const data = await res.json() as { message: string };
    success = res.ok;
    message = data.message;
  } catch {
    message = 'Something went wrong. Please try again.';
  }

  return (
    <div className="min-h-screen bg-(--bg-base) flex items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${success
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-red-500/10 border border-red-500/20'
          }`}>
          <span className="text-2xl">{success ? '👋' : '✗'}</span>
        </div>
        <h1 className="text-lg font-semibold text-(--text-primary) mb-2">
          {success ? 'Unsubscribed successfully' : 'Something went wrong'}
        </h1>
        <p className="text-sm text-(--text-muted) mb-6">{message}</p>
        {success && (
          <p className="text-xs text-(--text-muted)">
            You will no longer receive changelog update emails.
          </p>
        )}
      </div>
    </div>
  );
}