'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function NewTripCompletionDialog({ open, onOpenChange, booking }: { open: boolean, onOpenChange: (open: boolean) => void, booking: any }) { 
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                NewTripCompletionDialog
            </DialogContent>
        </Dialog>
    );
}
