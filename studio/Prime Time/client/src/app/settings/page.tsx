'use client';
import { AppShell } from '@/components/app-shell';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const accentColors = [
    { name: 'Teal', color: 'hsl(180, 100%, 25%)' },
    { name: 'Indigo', color: 'hsl(275, 100%, 25%)' },
    { name: 'Rose', color: 'hsl(346.8, 77.2%, 49.8%)' },
    { name: 'Amber', color: 'hsl(45, 93%, 47%)' },
    { name: 'Violet', color: 'hsl(262.1, 83.3%, 57.8%)' },
  ];

  return (
    <AppShell title="Settings">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <ThemeToggle />
            </div>
             <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex flex-wrap gap-2">
                {accentColors.map((item) => (
                  <Button
                    key={item.name}
                    variant="outline"
                    className="h-8 w-8 rounded-full p-0 border-2 border-transparent focus:border-primary"
                    style={{ backgroundColor: item.color }}
                    aria-label={`Set accent color to ${item.name}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
