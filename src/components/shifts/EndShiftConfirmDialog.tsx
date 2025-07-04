
'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy, DollarSign, Target, TrendingUp, Timer } from "lucide-react";
import { useDriverSession } from "@/contexts/DriverSessionContext";
import { useShiftTimer } from "@/hooks/useShiftTimer";
import { useState } from "react";
import { formatTime } from "@/lib/formatTime";

interface EndShiftConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  shiftDurationHours: number;
}

export function EndShiftConfirmDialog({ open, onOpenChange, onConfirm, shiftDurationHours }: EndShiftConfirmDialogProps) {
  const { state } = useDriverSession();
  const { getTotalEarningTimeSeconds } = useShiftTimer();
  const [copySuccess, setCopySuccess] = useState(false);

  // Calculate all metrics for the summary
  const totalEarnings = state.totalEarningsThisShift;
  const totalExpenses = state.totalExpensesThisShift;
  const netEarnings = totalEarnings - totalExpenses;
  const tripCount = state.currentTrips.length;
  
  const earningTimeSeconds = getTotalEarningTimeSeconds();
  const totalShiftSeconds = shiftDurationHours * 3600;
  const breakTimeSeconds = totalShiftSeconds - earningTimeSeconds;

  const earningHours = earningTimeSeconds > 0 ? earningTimeSeconds / 3600 : 0;
  const hourlyRate = earningHours > 0 ? netEarnings / earningHours : 0;
  
  const efficiency = shiftDurationHours > 0 ? Math.min((earningHours / shiftDurationHours) * 100, 100) : 0;

  const targetProgress = state.dailyGoal > 0 ? (netEarnings / state.dailyGoal) * 100 : 0;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleCopy = async () => {
    const summaryText = `
SHIFT SUMMARY - ${new Date(state.shiftStartTime || 0).toLocaleDateString()}
---------------------------------
TIME
• Total Shift: ${formatTime(totalShiftSeconds)}
• Earning Time: ${formatTime(earningTimeSeconds)}
• Downtime: ${formatTime(breakTimeSeconds)}
• Efficiency: ${efficiency.toFixed(1)}%

EARNINGS
• Gross: $${totalEarnings.toFixed(2)}
• Expenses: $${totalExpenses.toFixed(2)}
• Net: $${netEarnings.toFixed(2)}
• Hourly Rate: $${hourlyRate.toFixed(2)}/hr

TRIPS
• Total Trips: ${tripCount}
• Avg per Trip: $${tripCount > 0 ? (totalEarnings/tripCount).toFixed(2) : '0.00'}

GOAL
• Target: $${state.dailyGoal.toFixed(2)}
• Progress: ${targetProgress.toFixed(1)}%
---------------------------------
    `.trim();

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            End Shift Confirmation
          </DialogTitle>
          <DialogDescription>
            Review your shift summary before ending. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Time Breakdown */}
            <div className="space-y-2 rounded-lg border p-3">
                <h4 className="font-semibold text-sm flex items-center gap-2"><Timer className="h-4 w-4"/>Time Breakdown</h4>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Shift</span> <span>{formatTime(totalShiftSeconds)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Earning Time</span> <span className="text-green-500">{formatTime(earningTimeSeconds)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Downtime</span> <span>{formatTime(breakTimeSeconds)}</span></div>
            </div>

            {/* Earnings */}
            <div className="space-y-2 rounded-lg border p-3">
                <h4 className="font-semibold text-sm flex items-center gap-2"><DollarSign className="h-4 w-4"/>Earnings</h4>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gross Earnings</span> <span>$${totalEarnings.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Expenses</span> <span className="text-destructive">-$${totalExpenses.toFixed(2)}</span></div>
                <div className="flex justify-between text-base font-bold"><span className="">Net Earnings</span> <span>$${netEarnings.toFixed(2)}</span></div>
            </div>

            {/* Performance */}
            <div className="space-y-2 rounded-lg border p-3">
                <h4 className="font-semibold text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4"/>Performance</h4>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Trips</span> <span>{tripCount}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Net Hourly Rate</span> <span>$${hourlyRate.toFixed(2)}/hr</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Efficiency</span> <span>{efficiency.toFixed(1)}%</span></div>
            </div>
             {/* Target */}
            <div className="space-y-2 rounded-lg border p-3">
                <h4 className="font-semibold text-sm flex items-center gap-2"><Target className="h-4 w-4"/>Daily Target</h4>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Goal</span> <span>$${state.dailyGoal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Net Earnings</span> <span>$${netEarnings.toFixed(2)}</span></div>
                <div className="flex justify-between text-base font-bold"><span className="">Progress</span> <span className={`${targetProgress >= 100 ? 'text-green-500':'text-foreground'}`}>{targetProgress.toFixed(1)}%</span></div>
            </div>
        </div>
        
        <DialogFooter className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={handleCancel} className="col-span-1">Cancel</Button>
            <Button variant="secondary" onClick={handleCopy} className="col-span-1">
              <Copy className="h-4 w-4 mr-2" />
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button onClick={handleConfirm} className="bg-destructive hover:bg-destructive/90 col-span-1">End Shift</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
