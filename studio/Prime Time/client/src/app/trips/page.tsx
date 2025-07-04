import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TripsPage() {
  return (
    <AppShell title="Trip Log">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>My Trips</CardTitle>
            <CardDescription>
              Here you can log and view all your trips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Trip logging functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
