import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookingsPage() {
  return (
    <AppShell title="Private Bookings">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>
              Manage your private bookings and client information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Private booking management will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
