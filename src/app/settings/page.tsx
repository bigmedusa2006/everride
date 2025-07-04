
'use client';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Settings Moved</CardTitle>
            <CardDescription>
              All settings are now located in the main dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href="/">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
