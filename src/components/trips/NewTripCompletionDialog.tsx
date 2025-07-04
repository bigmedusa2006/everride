
'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDriverSession } from '@/contexts/DriverSessionContext';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@shared/schema';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currency';

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
  const { state: sessionState, dispatch: sessionDispatch } = useDriverSession();
  const { toast } = useToast();

  const [fare, setFare] = useState("0");
  const [tip, setTip] = useState("0");
  const [activeInput, setActiveInput] = useState<'fare' | 'tip'>('fare');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (open) {
      if (booking?.fare) {
        setFare(booking.fare.toString());
      } else {
        setFare("0");
      }
      setTip("0");
      setActiveInput('fare');
      setIsSubmitting(false);
    }
  }, [open, booking]);

  const handleInput = (value: string) => {
    const setter = activeInput === 'fare' ? setFare : setTip;
    const currentValue = activeInput === 'fare' ? fare : tip;

    if (value === 'backspace') {
      setter(currentValue.slice(0, -1) || "0");
      return;
    }
    if (value === 'clear') {
      setter("0");
      return;
    }
    if (value === '.' && currentValue.includes('.')) {
      return;
    }

    // Handle initial '0'
    let newValue = (currentValue === "0" && value !== '.') ? value : currentValue + value;
    
    // Prevent multiple '00' at the start
    if (newValue === '00' && currentValue === '0') {
      newValue = '0';
    }

    if (newValue.includes('.')) {
        const parts = newValue.split('.');
        if (parts[1] && parts[1].length > 2) return;
    } else {
        if (newValue.length > 6) return;
    }

    setter(newValue);
  };

  const handleConfirm = async () => {
    const finalFare = parseFloat(fare) || 0;
    const finalTip = parseFloat(tip) || 0;

    if (finalFare <= 0) {
      toast({
        title: "Invalid Fare",
        description: "Please enter a fare amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
        const tripDuration = sessionState.currentTripStartTime ? (Date.now() - sessionState.currentTripStartTime) / 1000 : 0;
        sessionDispatch({
          type: 'END_TRIP',
          payload: { 
              fare: finalFare, 
              tip: finalTip, 
              durationSeconds: tripDuration, 
              pickupLocation: booking?.pickupLocation || "Live Trip", 
              dropoffLocation: booking?.dropoffLocation || "N/A" 
            },
        });
        toast({
          title: "Trip Completed",
          description: `Logged earnings of ${formatCurrency(finalFare + finalTip)}`,
        });
      
      onOpenChange(false);

    } catch (error) {
      console.error('Error confirming trip:', error);
      toast({
        title: "Error",
        description: "Failed to confirm. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayValue = activeInput === 'fare' ? fare : tip;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-4 sm:p-6 bg-card border-none shadow-2xl rounded-2xl flex flex-col h-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Complete Trip</DialogTitle>
        </DialogHeader>
        {/* Display Screen */}
        <div className="bg-muted/50 rounded-xl p-4 text-right space-y-2">
            <p className="text-xs uppercase text-muted-foreground">{activeInput}</p>
            <p className="text-5xl font-bold text-card-foreground truncate">
                <span className="font-sans">$</span>{currentDisplayValue}
            </p>
            <p className="text-sm text-muted-foreground">
                Fare: {formatCurrency(parseFloat(fare))} | Tip: {formatCurrency(parseFloat(tip))}
            </p>
        </div>

        {/* Fare/Tip Toggle */}
        <div className="grid grid-cols-2 gap-2 my-4">
            <Button
                onClick={() => setActiveInput('fare')}
                variant={activeInput === 'fare' ? 'default' : 'outline'}
                className="h-12 text-base"
            >
                FARE
            </Button>
            <Button
                onClick={() => setActiveInput('tip')}
                variant={activeInput === 'tip' ? 'default' : 'outline'}
                className="h-12 text-base"
            >
                TIP
            </Button>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-4 gap-2 flex-1">
            <Button onClick={() => handleInput('7')} variant="outline" className="h-16 text-2xl font-semibold">7</Button>
            <Button onClick={() => handleInput('8')} variant="outline" className="h-16 text-2xl font-semibold">8</Button>
            <Button onClick={() => handleInput('9')} variant="outline" className="h-16 text-2xl font-semibold">9</Button>
            <Button onClick={() => handleInput('backspace')} variant="outline" className="h-16 text-2xl"><Trash2 /></Button>
            
            <Button onClick={() => handleInput('4')} variant="outline" className="h-16 text-2xl font-semibold">4</Button>
            <Button onClick={() => handleInput('5')} variant="outline" className="h-16 text-2xl font-semibold">5</Button>
            <Button onClick={() => handleInput('6')} variant="outline" className="h-16 text-2xl font-semibold">6</Button>
            <Button onClick={() => handleInput('.')} variant="outline" className="h-16 text-2xl font-semibold">.</Button>

            <Button onClick={() => handleInput('1')} variant="outline" className="h-16 text-2xl font-semibold">1</Button>
            <Button onClick={() => handleInput('2')} variant="outline" className="h-16 text-2xl font-semibold">2</Button>
            <Button onClick={() => handleInput('3')} variant="outline" className="h-16 text-2xl font-semibold">3</Button>
            <Button onClick={() => handleInput('clear')} variant="destructive" className="h-16 text-lg">CLR</Button>
            
            <Button onClick={() => handleInput('0')} variant="outline" className="h-16 text-2xl font-semibold col-span-2">0</Button>
            <Button onClick={() => handleInput('00')} variant="outline" className="h-16 text-2xl font-semibold col-span-2">00</Button>
        </div>
        
        <Button 
            onClick={handleConfirm}
            disabled={isSubmitting || parseFloat(fare) <= 0}
            className="w-full h-14 mt-4 text-lg font-bold"
        >
            {isSubmitting ? 'Adding...' : 'Add Trip'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
