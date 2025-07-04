
import { AppShell } from '@/components/app-shell';
import { SoundSettings } from '@/components/settings/SoundSettings';

export default function SoundSettingsPage() {
  return (
    <AppShell title="Sound Customization">
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
            <SoundSettings />
        </div>
    </AppShell>
  );
}
