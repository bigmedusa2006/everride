'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    shiftDurationHours: number;
}
export function EndShiftConfirmDialog({ open, onOpenChange, onConfirm, shiftDurationHours }: Props) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to end your shift?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your shift has been active for {shiftDurationHours.toFixed(1)} hours.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>End Shift</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
