
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MapPin, PhoneCall, Calendar, Edit2, User, Home, DollarSign, Car, Check, Trash2, AlertTriangle, Navigation, Timer, QrCode } from "lucide-react";
import { useBookingStore } from '@/stores/bookingStore';
import { VCard } from '@/components/business/VCard';
import { formatCurrency } from '@/lib/currency';
import { NewTripCompletionDialog } from './CompleteReservationDialog';
import { EditBookingDialog } from './EditReservationsDialog';
import { BookingStatusMenu } from './BookingStatusMenu';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@shared/schema';
import { CreateBookingForm } from './CreateBookingForm';


export function PrivateBookingsCard() {
  const { bookings, isLoading, loadUpcomingBookings, deleteBooking } = useBookingStore();
  const { toast } = useToast();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [swipeState, setSwipeState] = useState<{ [key: string]: { startX: number, startY: number, swiping: boolean } }>({});

  useEffect(() => {
    loadUpcomingBookings();
    notificationService.initialize();
  }, [loadUpcomingBookings]);

  useEffect(() => {
    bookings.forEach(booking => {
      if (booking.scheduledDate && booking.scheduledTime && booking.clientName && booking.pickupLocation) {
        try {
          const pickupTime = new Date(`${booking.scheduledDate} ${booking.scheduledTime}`);
          if (!isNaN(pickupTime.getTime())) {
            notificationService.schedulePickupReminder(booking.id, pickupTime, booking.clientName, booking.pickupLocation);
          }
        } catch (error) {
          console.error('Error scheduling reminder for booking:', booking.id, error);
        }
      }
    });
  }, [bookings]);

  const getTimeUntilPickup = (scheduledDate: string, scheduledTime: string) => {
    try {
      const pickupTime = new Date(`${scheduledDate} ${scheduledTime}`);
      if (isNaN(pickupTime.getTime())) return { text: scheduledTime, isUrgent: false, isPast: false };

      const now = new Date();
      const diff = pickupTime.getTime() - now.getTime();
      const minutes = Math.floor(diff / 60000);

      if (minutes <= 0) return { text: 'Now', isUrgent: true, isPast: true };
      if (minutes <= 30) return { text: `${minutes}m`, isUrgent: true, isPast: false };
      if (minutes <= 120) return { text: `${Math.floor(minutes / 60)}h ${minutes % 60}m`, isUrgent: false, isPast: false };

      return { text: format(pickupTime, 'p'), isUrgent: false, isPast: false };
    } catch (error) {
      return { text: scheduledTime, isUrgent: false, isPast: false };
    }
  };

  const handleNavigate = (booking: Booking) => {
    if (booking.pickupLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.pickupLocation)}`;
      window.open(url, '_blank');
      toast({ title: "Navigation Launched", description: `Opening directions to ${booking.pickupLocation}` });
    }
  };

  const handleTouchStart = (e: React.TouchEvent, bookingId: string) => {
    const touch = e.touches[0];
    setSwipeState(prev => ({ ...prev, [bookingId]: { startX: touch.clientX, startY: touch.clientY, swiping: false } }));
  };

  const handleTouchMove = (e: React.TouchEvent, bookingId: string) => {
    const currentState = swipeState[bookingId];
    if (!currentState) return;

    const touch = e.touches[0];
    if (Math.abs(touch.clientX - currentState.startX) > 10 && Math.abs(touch.clientX - currentState.startX) > Math.abs(touch.clientY - currentState.startY)) {
      setSwipeState(prev => ({ ...prev, [bookingId]: { ...currentState, swiping: true } }));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, booking: Booking) => {
    const currentState = swipeState[booking.id];
    if (currentState?.swiping && (currentState.startX - e.changedTouches[0].clientX > 100)) {
        handleDeleteBooking(booking);
    }
    setSwipeState(prev => { const newState = { ...prev }; delete newState[booking.id]; return newState; });
  };

  const handleCompleteBooking = (booking: Booking) => { setSelectedBooking(booking); setShowCompleteDialog(true); };
  const handleEditBooking = (booking: Booking) => { setSelectedBooking(booking); setShowEditDialog(true); };
  const handleDeleteBooking = (booking: Booking) => { setBookingToDelete(booking); setShowDeleteDialog(true); };

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteBooking(bookingToDelete.id);
      toast({ title: "Booking Deleted", description: `Booking for ${bookingToDelete.clientName} has been removed.` });
    } catch (error) {
      toast({ title: "Delete Failed", description: "Could not delete the booking.", variant: "destructive" });
    } finally {
      setShowDeleteDialog(false); setBookingToDelete(null);
    }
  };

  const handleCallClient = (booking: Booking) => {
    if (booking.clientPhone) window.open(`tel:${booking.clientPhone.replace(/\D/g, '')}`, '_self');
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="my-trips" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted">
          <TabsTrigger value="book" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><Car className="h-4 w-4 mr-2" />Book</TabsTrigger>
          <TabsTrigger value="my-trips" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><Calendar className="h-4 w-4 mr-2" />My Trips</TabsTrigger>
          <TabsTrigger value="qr-vcard" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><QrCode className="h-4 w-4 mr-2" />QR vCard</TabsTrigger>
        </TabsList>

        <TabsContent value="qr-vcard" className="mt-0 max-w-md mx-auto">
          <VCard />
        </TabsContent>

        <TabsContent value="my-trips" className="mt-0 space-y-4">
          <Card className="w-full relative overflow-hidden bg-card/10 border border-border shadow-lg transition-all duration-500 hover:shadow-xl rounded-2xl">
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br from-accent/20 to-accent/30 dark:from-accent/40 dark:to-accent/50 rounded-full opacity-60"></div>
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-accent/20 to-secondary/30 dark:from-accent/40 dark:to-secondary/50 rounded-full opacity-50"></div>
            <CardContent className="p-4 relative z-10">
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, i) => <div key={i} className="rounded-xl bg-card/10 border border-border p-3 space-y-2 shadow-lg"><div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><div className="h-4 w-24 bg-muted-foreground/20 rounded-md" /></div><div className="h-4 w-full bg-muted-foreground/20 rounded-md" /></div>)
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 bg-card/50 rounded-xl border border-border">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-card-foreground text-sm">No upcoming bookings</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="booking-card group relative rounded-xl bg-card/10 border border-border min-w-[300px] p-3 space-y-2 shadow-lg transition-all hover:bg-card/15 hover:shadow-xl touch-pan-y select-none" onTouchStart={(e) => handleTouchStart(e, booking.id)} onTouchMove={(e) => handleTouchMove(e, booking.id)} onTouchEnd={(e) => handleTouchEnd(e, booking)}>
                      {(() => {
                        const statusColors = {
                          scheduled: 'bg-blue-500',
                          confirmed: 'bg-green-500', 
                          completed: 'bg-emerald-500',
                          cancelled: 'bg-red-500',
                          'no-show': 'bg-orange-500'
                        };
                        return <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${statusColors[booking.status as keyof typeof statusColors] || 'bg-blue-500'}`} />;
                      })()}
                      <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><h4 className="text-sm font-medium text-card-foreground">{booking.clientName}</h4></div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Home className="h-3 w-3 text-accent" /><span>{booking.pickupLocation}</span><span>→</span><MapPin className="h-3 w-3 text-accent" /><span>{booking.dropoffLocation}</span></div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3 text-accent" />
                        <span>{format(new Date(booking.scheduledDate), 'MMM d, yyyy')}</span>
                        <span>at</span>
                        <span className="font-medium">{booking.scheduledTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {(() => { const timeInfo = getTimeUntilPickup(booking.scheduledDate, booking.scheduledTime); return (<div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${timeInfo.isPast ? 'bg-destructive/20 text-destructive' : timeInfo.isUrgent ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}><Timer className="h-3 w-3" /><span>{timeInfo.isPast ? 'Due Now' : `In ${timeInfo.text}`}</span></div>); })()}
                        <div className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-green-500" /><span className="text-sm font-semibold text-green-500">{formatCurrency(booking.fare)}</span></div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-border mt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white flex-1"
                                onClick={() => handleNavigate(booking)}
                              >
                                <Navigation className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Start Navigation</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 flex-1"
                                onClick={() => handleCallClient(booking)}
                              >
                                <PhoneCall className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Call Customer</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 flex-1"
                                onClick={() => handleEditBooking(booking)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <BookingStatusMenu booking={booking} onComplete={handleCompleteBooking} />

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10 flex-1"
                                onClick={() => handleDeleteBooking(booking)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="book" className="mt-0">
           <CreateBookingForm />
        </TabsContent>
      </Tabs>

      <NewTripCompletionDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog} booking={selectedBooking} />
      <EditBookingDialog open={showEditDialog} onOpenChange={setShowEditDialog} booking={selectedBooking} />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action for <span className="font-semibold text-foreground">{bookingToDelete?.clientName}</span> cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBooking} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
