'use client';
import { DriverDashboard } from "@/components/driver-dashboard";
import { DriverSessionProvider } from "@/contexts/DriverSessionContext";

export default function DashboardPage() {
  return (
    <DriverSessionProvider>
      <DriverDashboard />
    </DriverSessionProvider>
  );
}
