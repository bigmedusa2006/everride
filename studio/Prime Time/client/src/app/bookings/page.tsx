
import { AppShell } from '@/components/app-shell';
import { PrivateBookingsCard } from '@/components/bookings/Reservations';

export default function BookingsPage() {
  return (
    <AppShell title="Reservations">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <PrivateBookingsCard />
      </div>
    </AppShell>
  );
}
