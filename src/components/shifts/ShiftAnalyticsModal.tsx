'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function ShiftAnalyticsModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                ShiftAnalyticsModal
            </DialogContent>
        </Dialog>
    );
}
