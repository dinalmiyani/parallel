'use client';

import { useState } from 'react';
import { Upload, ExternalLink } from 'lucide-react';

export default function BrandingSettingsPage() {
  const [color, setColor] = useState('#2563EB');

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-base font-semibold text-(--text-primary)">Branding</h2>
        <p className="text-sm text-(--text-muted) mt-0.5">Customize your public changelog page</p>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Logo</h3>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-(--bg-overlay) border border-(--border) flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>

          <div className="flex-1">
            <div className="border-2 border-dashed border-(--border) rounded-xl p-4 hover:border-blue-500/40 transition-colors cursor-pointer text-center">
              <Upload size={16} className="text-(--text-muted) mx-auto mb-1.5" />
              <p className="text-xs text-(--text-secondary)">Drop image or click to upload</p>
              <p className="text-[11px] text-(--text-muted) mt-0.5">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-(--text-primary)">Brand Color</h3>
        <p className="text-xs text-(--text-muted)">Used for buttons and accents on your public page</p>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-10 h-10 rounded-lg border border-(--border) bg-(--bg-overlay) cursor-pointer p-1"
          />
          <input
            type="text"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="flex-1 px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) font-mono focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {['#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0891B2'].map(c => (
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
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-(--text-primary)">Custom Domain</h3>
          <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">
            Pro
          </span>
        </div>
        <p className="text-xs text-(--text-muted)">
          Point your own domain to your changelog page instead of using the default URL.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--text-muted)">Custom domain</label>
          <input
            placeholder="changelog.yourcompany.com"
            className="w-full px-3 py-2 bg-(--bg-overlay) border border-(--border) rounded-lg text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-blue-500 transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 bg-(--bg-overlay) border border-(--border) rounded-lg">
          <span className="text-xs text-(--text-muted)">Current URL:</span>
          <span className="text-xs text-blue-400 font-mono">ajay-workspace.parallel.is-a.dev</span>
          <ExternalLink size={11} className="text-(--text-muted) ml-auto" />
        </div>
      </div>

      <div className="bg-(--bg-raised) border border-(--border) rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-(--text-primary)">Hide "Powered by Parallel"</p>
            <p className="text-xs text-(--text-muted) mt-0.5">Remove the branding from your public page footer</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">Pro</span>
            <button className="relative w-9 h-5 rounded-full bg-(--bg-overlay) border border-(--border) opacity-50 cursor-not-allowed">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>
      </div>

      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
        Save changes
      </button>
    </div>
  );
}