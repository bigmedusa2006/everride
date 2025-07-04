'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export type ShiftConfig = {
    dailyGoal: number;
    plannedDurationHours: number;
    driverName: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStartShift: (config: ShiftConfig) => void;
};

export function ShiftConfigDialog({ open, onOpenChange, onStartShift }: Props) {
    const [dailyGoal, setDailyGoal] = useState(200);
    const [plannedDurationHours, setPlannedDurationHours] = useState(8);
    const [driverName, setDriverName] = useState('John Doe');

    const handleStart = () => {
        onStartShift({ dailyGoal, plannedDurationHours, driverName });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start New Shift</DialogTitle>
                    <DialogDescription>Set your goals for this shift.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="driverName">Driver Name</Label>
                        <Input id="driverName" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dailyGoal">Daily Goal ($)</Label>
                        <Input id="dailyGoal" type="number" value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Planned Duration (hours)</Label>
                        <Input id="duration" type="number" value={plannedDurationHours} onChange={(e) => setPlannedDurationHours(Number(e.target.value))} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleStart}>Start Shift</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
