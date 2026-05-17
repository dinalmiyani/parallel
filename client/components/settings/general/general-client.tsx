'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2, Check, X } from 'lucide-react';
import { useApi } from '@/lib/api/client';

interface OrgSettings {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

interface Props {
  settings: OrgSettings;
}

export default function GeneralSettingsClient({ settings }: Props) {
  const api = useApi();

  const [name, setName] = useState(settings.name);
  const [slug, setSlug] = useState(settings.slug);
  const [saving, setSaving] = useState(false);
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [notifyNew, setNotifyNew] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(false);
  const [notifyImport, setNotifyImport] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (slug === settings.slug) { setSlugStatus('idle'); return; }
    if (!slug || slug.length < 2) { setSlugStatus('idle'); return; }

    setSlugStatus('checking');
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await api.get<{ available: boolean }>(
          `/settings/check-slug?slug=${encodeURIComponent(slug)}`,
        );
        setSlugStatus(result.available ? 'available' : 'taken');
      } catch {
        setSlugStatus('idle');
      }
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [slug]);

  const handleSave = async () => {
    if (slugStatus === 'taken') { toast.error('Slug is already taken'); return; }
    if (!name.trim()) { toast.error('Name is required'); return; }

    setSaving(true);
    try {
      await api.patch('/settings/general', {
        name: name.trim(),
        slug: slug.trim(),
      });
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">

      <div>
        <h2 className="text-base font-semibold text-(--text-primary)">General</h2>
        <p className="text-sm text-(--text-muted) mt-0.5">Manage your workspace settings</p>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Workspace</h3>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted)">
            Workspace name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted)">Slug</label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-(--bg-overlay) border border-(--border) border-r-0 rounded-l-lg text-sm text-(--text-muted) whitespace-nowrap">
              parallel.is-a.dev/
            </span>
            <div className="relative flex-1">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-r-lg text-sm text-(--text-primary) font-mono focus:outline-none focus:border-blue-500 transition-colors pr-8"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {slugStatus === 'checking' && <Loader2 size={13} className="animate-spin text-(--text-muted)" />}
                {slugStatus === 'available' && <Check size={13} className="text-emerald-400" />}
                {slugStatus === 'taken' && <X size={13} className="text-red-400" />}
              </div>
            </div>
          </div>

          <p className={`text-[11px] ${slugStatus === 'available' ? 'text-emerald-400' :
              slugStatus === 'taken' ? 'text-red-400' :
                'text-(--text-muted)'
            }`}>
            {slugStatus === 'available' ? '✓ Slug is available' :
              slugStatus === 'taken' ? '✗ Slug is already taken' :
                'Your public changelog URL'}
          </p>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-(--border)">
          <span className="text-xs text-(--text-muted)">Current plan</span>
          <span className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5">
            {settings.plan}
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || slugStatus === 'taken'}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Email Notifications</h3>

        {[
          {
            label: 'New subscriber joins',
            sub: 'Get notified when someone subscribes',
            value: notifyNew,
            set: setNotifyNew,
          },
          {
            label: 'Weekly digest',
            sub: 'Summary of activity every Monday',
            value: notifyDigest,
            set: setNotifyDigest,
          },
          {
            label: 'GitHub import complete',
            sub: 'When new PRs are imported',
            value: notifyImport,
            set: setNotifyImport,
          },
        ].map(({ label, sub, value, set }) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--text-primary)">{label}</p>
              <p className="text-xs text-(--text-muted) mt-0.5">{sub}</p>
            </div>
            <button
              onClick={() => set((p: boolean) => !p)}
              className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${value ? 'bg-blue-600' : 'bg-(--bg-overlay) border border-(--border)'
                }`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-[18px]' : 'left-0.5'
                }`} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}