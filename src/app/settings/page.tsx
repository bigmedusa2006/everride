
import { AppShell } from '@/components/app-shell';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, Paintbrush, Bell, Music } from 'lucide-react';

const settingsItems = [
  {
    href: '/settings/appearance',
    title: 'Appearance',
    description: 'Customize the look and feel of the app.',
    icon: <Paintbrush className="h-6 w-6" />,
  },
  {
    href: '/settings/notifications',
    title: 'Notifications',
    description: 'Manage how and when you receive alerts.',
    icon: <Bell className="h-6 w-6" />,
  },
  {
    href: '/settings/sounds',
    title: 'Sound Customization',
    description: 'Personalize your audio alerts.',
    icon: <Music className="h-6 w-6" />,
  },
];

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          {settingsItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                        {item.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                       <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
