'use client';
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, MapPin, User, Car, Timer, Calculator } from "lucide-react";
import { useBookingStore } from '@/stores/bookingStore';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@shared/schema';
import { RideFeedback } from '@/components/feedback/RideFeedback';

interface NewTripCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking | null;
}

export function NewTripCompletionDialog({ 
  open, 
  onOpenChange, 
  booking = null
}: NewTripCompletionDialogProps) {
  const { completeBooking } = useBookingStore();
  const { toast } = useToast();

  const [fareAmount, setFareAmount] = useState('');
  const [tipAmount, setTipAmount] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedBookingId, setCompletedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setShowFeedback(false);
      if (booking) {
        const bookingFare = booking.fare;
        setFareAmount(bookingFare.toFixed(2));
        setTipAmount('0');
      } else {
        setFareAmount('');
        setTipAmount('0');
      }
    }
  }, [open, booking]);

  const quickTipAmounts = [0, 5, 10, 15, 20];

  const handleQuickTip = (amount: number) => {
    setTipAmount(amount.toString());
  };

  const handleConfirm = async () => {
    const fare = parseFloat(fareAmount) || 0;
    const tip = parseFloat(tipAmount) || 0;
    const total = fare + tip;

    if (fare <= 0) {
      toast({
        title: "Invalid Fare",
        description: "Please enter a valid fare amount",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (booking) {
        await completeBooking(booking.id, { fare, tip });
        setCompletedBookingId(booking.id);
      }

      toast({
        title: "Reservation Confirmed",
        description: `Fare: $${fare.toFixed(2)}, Tip: $${tip.toFixed(2)}, Total: $${total.toFixed(2)}`,
      });

      onOpenChange(false);
      
      if (booking) {
        setTimeout(() => setShowFeedback(true), 300);
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
      toast({
        title: "Error",
        description: "Failed to confirm reservation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = (parseFloat(fareAmount) || 0) + (parseFloat(tipAmount) || 0);

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Complete Trip
            </AlertDialogTitle>
            <AlertDialogDescription>
              {booking ? (
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{booking.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <Badge variant="secondary" className="text-xs">Private Booking</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {booking.pickupLocation} → {booking.dropoffLocation}
                  </div>
                </div>
              ) : (
                "Enter trip details to complete this manual trip entry."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="fare" className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                {booking ? 'Agreed Fare' : 'Trip Fare'}
              </Label>
              <Input
                id="fare"
                type="number"
                step="0.01"
                min="0"
                value={fareAmount}
                onChange={(e) => setFareAmount(e.target.value)}
                placeholder="0.00"
                className="text-lg font-mono"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tip" className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Customer Tip
              </Label>
              <Input
                id="tip"
                type="number"
                step="0.01"
                min="0"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="0.00"
                className="text-lg font-mono"
              />

              <div className="flex gap-2 flex-wrap">
                <Label className="text-xs text-muted-foreground">Quick Tips:</Label>
                {quickTipAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 px-3"
                    onClick={() => handleQuickTip(amount)}
                    type="button"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fare:</span>
                    <span className="font-mono">${(parseFloat(fareAmount) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tip:</span>
                    <span className="font-mono">${(parseFloat(tipAmount) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total Earnings:</span>
                    <span className="font-mono text-green-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isSubmitting || !fareAmount || parseFloat(fareAmount) <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {completedBookingId && (
        <RideFeedback
          bookingId={completedBookingId}
          open={showFeedback}
          onOpenChange={setShowFeedback}
          onSubmitted={() => {
            setShowFeedback(false);
            setCompletedBookingId(null);
            toast({
              title: "Thank you!",
              description: "Your feedback helps us provide better service.",
            });
          }}
        />
      )}
    </>
  );
}
