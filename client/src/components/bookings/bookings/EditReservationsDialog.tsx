
'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Booking } from '@shared/schema';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: Booking | null;
};

export function EditBookingDialog({ open, onOpenChange, booking }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Reservation</DialogTitle>
                    <DialogDescription>
                        Editing reservation for {booking?.clientName}. This feature is under construction.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
