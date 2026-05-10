import { OrganizationProfile } from '@clerk/nextjs';

export default function TeamSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-(--text-primary)">Team</h2>
        <p className="text-sm text-(--text-muted) mt-0.5">Manage members and roles</p>
      </div>

      <OrganizationProfile
        routing="hash"
      />
    </div>
  );
}