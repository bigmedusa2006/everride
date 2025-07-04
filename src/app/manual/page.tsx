import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManualPage() {
  return (
    <AppShell title="Manual">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>App Manual</CardTitle>
            <CardDescription>
              Instructions and help on using the app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>App manual will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
