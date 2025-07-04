import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <AppShell title="History">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>
              View your past trips and earnings history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>History functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
