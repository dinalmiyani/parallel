export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-base font-semibold text-(--text-primary)">General</h2>
        <p className="text-sm text-(--text-muted) mt-0.5">Manage your workspace settings</p>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Workspace</h3>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted)">Workspace name</label>
          <input
            defaultValue="Ajay's Workspace"
            className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted)">Slug</label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-(--bg-overlay) border border-(--border) border-r-0 rounded-l-lg text-sm text-(--text-muted) whitespace-nowrap">
              parallel.is-a.dev/
            </span>
            <input
              defaultValue="ajay-workspace"
              className="flex-1 px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-r-lg text-sm text-(--text-primary) focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </div>
          <p className="text-[11px] text-(--text-muted)">
            Your public changelog lives at this URL
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted)">Timezone</label>
          <select className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) focus:outline-none focus:border-blue-500 transition-colors">
            <option>Asia/Kolkata (IST, UTC+5:30)</option>
            <option>America/New_York (EST)</option>
            <option>Europe/London (GMT)</option>
            <option>America/Los_Angeles (PST)</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          Save changes
        </button>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Email Notifications</h3>

        {[
          { label: 'New subscriber joins', sub: 'Get notified when someone subscribes to your changelog' },
          { label: 'Weekly digest', sub: 'Summary of activity every Monday morning' },
          { label: 'GitHub import complete', sub: 'When new PRs are imported from GitHub' },
        ].map(({ label, sub }, i) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--text-primary)">{label}</p>
              <p className="text-xs text-(--text-muted) mt-0.5">{sub}</p>
            </div>
            <button
              className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${i !== 1 ? 'bg-blue-600' : 'bg-(--bg-overlay) border border-(--border)'
                }`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${i !== 1 ? 'left-[18px]' : 'left-0.5'
                }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}