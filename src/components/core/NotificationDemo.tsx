
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function NotificationDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Demo</CardTitle>
        <CardDescription>
          This section is for demonstrating different notification styles.
          Functionality is under construction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Previews of alert, toast, and system notifications will appear here.
        </p>
      </CardContent>
    </Card>
  );
}
