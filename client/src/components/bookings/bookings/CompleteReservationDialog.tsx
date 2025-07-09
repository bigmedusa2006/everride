
'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Booking } from '@shared/schema';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: Booking | null;
};

export function NewTripCompletionDialog({ open, onOpenChange, booking }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Complete Reservation</DialogTitle>
                    <DialogDescription>
                        Completing reservation for {booking?.clientName}. This feature is under construction.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
