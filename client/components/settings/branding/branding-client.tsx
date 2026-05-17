'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Upload, ExternalLink, Loader2 } from 'lucide-react';
import { useApi } from '@/lib/api/client';

interface OrgSettings {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  brandColor: string;
  domain: string | null;
  plan: string;
}

const PRESET_COLORS = [
  '#2563EB', '#7C3AED', '#059669',
  '#DC2626', '#D97706', '#0891B2',
];

interface Props {
  settings: OrgSettings;
}

export default function BrandingClient({ settings }: Props) {
  const api = useApi();

  const [color, setColor] = useState(settings.brandColor);
  const [domain, setDomain] = useState(settings.domain ?? '');
  const [saving, setSaving] = useState(false);

  const isPro = settings.plan === 'PRO' || settings.plan === 'TEAM';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/settings/branding', {
        brandColor: color,
        ...(isPro && domain ? { domain } : {}),
      });
      toast.success('Branding saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">

      <div>
        <h2 className="text-base font-semibold text-(--text-primary)">Branding</h2>
        <p className="text-sm text-(--text-muted) mt-0.5">
          Customize how your public changelog page looks
        </p>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Logo</h3>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-(--bg-overlay) border border-(--border) flex items-center justify-center flex-shrink-0">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt="Logo"
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-(--text-muted)">
                {settings.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 border-2 border-dashed border-(--border) rounded-xl p-4 hover:border-blue-500/40 transition-colors cursor-pointer text-center">
            <Upload size={16} className="text-(--text-muted) mx-auto mb-1.5" />
            <p className="text-xs text-(--text-secondary)">
              Drop image or click to upload
            </p>
            <p className="text-[11px] text-(--text-muted) mt-0.5">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Brand Color</h3>
        <p className="text-xs text-(--text-muted)">
          Used for buttons and accents on your public changelog page
        </p>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-lg border border-(--border) bg-(--bg-overlay) cursor-pointer p-1"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) font-mono focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: color === c ? 'white' : 'transparent',
                outline: color === c ? `2px solid ${c}` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 p-3 bg-(--bg-overlay) border border-(--border) rounded-lg">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {settings.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-(--text-primary)">{settings.name}</p>
            <p className="text-[11px] text-(--text-muted)">Changelog</p>
          </div>
          <button
            className="text-xs text-white px-2.5 py-1 rounded-md flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            Subscribe
          </button>
        </div>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-(--text-primary)">Custom Domain</h3>
          {!isPro && (
            <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">
              Pro
            </span>
          )}
        </div>

        {isPro ? (
          <div className="space-y-3">
            <p className="text-xs text-(--text-muted)">
              Point your own domain to your changelog instead of using the default URL.
            </p>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="changelog.yourcompany.com"
              className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) placeholder:text-(--text-muted) font-mono focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        ) : (
          <p className="text-xs text-(--text-muted)">
            Upgrade to Pro to use a custom domain.
          </p>
        )}

        <div className="flex items-center gap-2 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) rounded-lg">
          <span className="text-xs text-(--text-muted)">Current URL:</span>
          <span className="text-xs text-blue-400 font-mono">
            {settings.slug}.parallel.is-a.dev
          </span>
          <a
            href={`${appUrl}/${settings.slug}/changelog`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto"
          >
            <ExternalLink size={11} className="text-(--text-muted) hover:text-(--text-primary) transition-colors" />
          </a>
        </div>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-(--text-primary)">Hide "Powered by Parallel"</p>
            <p className="text-xs text-(--text-muted) mt-0.5">
              Remove branding from your public page footer
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isPro && (
              <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">
                Pro
              </span>
            )}
            <button
              disabled={!isPro}
              className={`relative w-9 h-5 rounded-full transition-colors ${!isPro
                  ? 'bg-(--bg-overlay) border border-(--border) opacity-50 cursor-not-allowed'
                  : 'bg-(--bg-overlay) border border-(--border)'
                }`}
            >
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {saving && <Loader2 size={13} className="animate-spin" />}
        {saving ? 'Saving...' : 'Save changes'}
      </button>

    </div>
  );
}