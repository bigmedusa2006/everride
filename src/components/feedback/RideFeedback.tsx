'use client';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface RideFeedbackProps {
    bookingId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmitted: () => void;
}

export function RideFeedback({ bookingId, open, onOpenChange, onSubmitted }: RideFeedbackProps) {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        // In a real app, you would send this to your backend
        onSubmitted();
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ride Feedback</AlertDialogTitle>
                    <AlertDialogDescription>
                        How was the trip? Your feedback is valuable.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="feedback-text">Your Comments</Label>
                    <Textarea 
                        id="feedback-text"
                        placeholder="e.g., The ride was smooth and the driver was very professional."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Skip</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Submit Feedback</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
