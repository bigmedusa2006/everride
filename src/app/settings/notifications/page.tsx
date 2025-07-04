
import { AppShell } from '@/components/app-shell';
import { NotificationSettings } from '@/components/core/NotificationSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsSettingsPage() {
  return (
    <AppShell title="Notification Settings">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <NotificationSettings />
      </div>
    </AppShell>
  );
}
