'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDriverSession } from '@/contexts/DriverSessionContext';
import { useShiftTimer } from '@/hooks/useShiftTimer';
import { formatTime } from '@/lib/formatTime';
import { formatCurrency } from '@/lib/currency';
import { Separator } from '@/components/ui/separator';
import { BarChart2, Briefcase, Clock, Coffee, DollarSign, Target, TrendingUp, Zap } from 'lucide-react';

export function ShiftAnalyticsModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { state } = useDriverSession();
    const { getCurrentShiftTimeSeconds, getTotalEarningTimeSeconds } = useShiftTimer();

    if (!state.isShiftActive) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>No Active Shift</DialogTitle>
                        <DialogDescription>
                            Start a shift to view analytics.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }
    
    const totalShiftSeconds = getCurrentShiftTimeSeconds();
    const totalEarningSeconds = getTotalEarningTimeSeconds();
    const idleTimeSeconds = totalShiftSeconds - totalEarningSeconds;
    
    const drivingEfficiency = totalShiftSeconds > 0 ? Math.round((totalEarningSeconds / totalShiftSeconds) * 100) : 0;
    
    const totalEarnings = state.currentTrips.reduce((sum, trip) => sum + trip.fare + (trip.tip || 0), 0);
    const totalExpenses = state.currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netEarnings = totalEarnings - totalExpenses;
    
    const earningHours = totalEarningSeconds / 3600;
    const netHourlyRate = earningHours > 0 ? netEarnings / earningHours : 0;
    const avgTripValue = state.currentTrips.length > 0 ? totalEarnings / state.currentTrips.length : 0;


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-primary" />
                        Shift Analytics
                    </DialogTitle>
                    <DialogDescription>
                        A summary of your performance during this shift.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-4">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Shift Time</dt>
                            <dd className="text-2xl font-bold font-mono">{formatTime(totalShiftSeconds)}</dd>
                        </div>
                         <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-4">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Briefcase className="h-3 w-3" /> Earning Time</dt>
                            <dd className="text-2xl font-bold font-mono">{formatTime(totalEarningSeconds)}</dd>
                        </div>
                    </div>
                     <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-4">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Coffee className="h-3 w-3" /> Idle Time</dt>
                            <dd className="text-xl font-bold font-mono">{formatTime(idleTimeSeconds)}</dd>
                        </div>

                    <Separator />
                    
                    <dl className="space-y-3">
                         <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> Driving Efficiency</dt>
                            <dd className="text-lg font-semibold">{drivingEfficiency}%</dd>
                         </div>
                         <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Zap className="h-4 w-4" /> Net Hourly Rate</dt>
                            <dd className="text-lg font-semibold">{formatCurrency(netHourlyRate)}</dd>
                         </div>
                    </dl>

                    <Separator />

                     <dl className="space-y-3">
                         <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Gross Earnings</dt>
                            <dd className="font-semibold">{formatCurrency(totalEarnings)}</dd>
                         </div>
                         <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 text-destructive"><DollarSign className="h-4 w-4" /> Total Expenses</dt>
                            <dd className="font-semibold text-destructive">{formatCurrency(totalExpenses)}</dd>
                         </div>
                          <div className="flex items-center justify-between text-lg">
                            <dt className="font-bold flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Net Earnings</dt>
                            <dd className="font-bold text-primary">{formatCurrency(netEarnings)}</dd>
                         </div>
                    </dl>

                     <Separator />

                        <dl className="space-y-3">
                         <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Target className="h-4 w-4" /> Trips Completed</dt>
                            <dd className="font-semibold">{state.currentTrips.length}</dd>
                         </div>
                         <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Avg. Earnings / Trip</dt>
                            <dd className="font-semibold">{formatCurrency(avgTripValue)}</dd>
                         </div>
                    </dl>

                </div>
            </DialogContent>
        </Dialog>
    );
}
