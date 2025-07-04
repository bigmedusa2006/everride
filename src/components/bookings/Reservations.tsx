'use client';

import { useState } from 'react';
import { useBookingStore } from '@/stores/bookingStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, User, Phone, MapPin, Navigation, Calendar, Clock, DollarSign } from 'lucide-react';
import { CreateBookingWidget } from '../widgets/CreateBookingWidget';
import { BookingStatusMenu } from '../Bookings/BookingStatusMenu';
import { Separator } from '../ui/separator';

export function PrivateBookingsCard() {
  const { bookings } = useBookingStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Reservations</CardTitle>
            <CardDescription>
              Manage your upcoming and past private bookings.
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create a New Reservation</DialogTitle>
              </DialogHeader>
              <div className="max-h-[80vh] overflow-y-auto p-1">
                <CreateBookingWidget onBookingCreated={() => setIsCreateOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No reservations yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">New bookings will appear here once created.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/30 p-4">
                  <div className="font-semibold">{booking.clientName}</div>
                  <BookingStatusMenu booking={booking} />
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.scheduledTime}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-green-500" />
                      <p>{booking.pickupLocation}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Navigation className="h-4 w-4 mt-0.5 text-red-500" />
                      <p>{booking.dropoffLocation}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold text-foreground">${booking.fare.toFixed(2)}</span>
                      <span className="text-xs">(est.)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="text-foreground">{booking.clientPhone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
