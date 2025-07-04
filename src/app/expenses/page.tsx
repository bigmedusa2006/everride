import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExpensesPage() {
  return (
    <AppShell title="Expense Tracker">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>My Expenses</CardTitle>
            <CardDescription>
              Log and manage your work-related expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Expense tracking functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
