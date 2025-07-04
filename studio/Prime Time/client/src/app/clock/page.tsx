import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClockPage() {
  return (
    <AppShell title="Clock">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Clock</CardTitle>
            <CardDescription>
              Manage your work hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Clock functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
