
'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy, Target, Car, Timer, Receipt, TrendingUp, Clock, DollarSign } from "lucide-react";
import { useDriverSession, type Trip, type Expense } from "@/contexts/DriverSessionContext";
import { useState } from "react";

interface EndShiftConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  shiftDurationHours: number;
}

export function EndShiftConfirmDialog({ open, onOpenChange, onConfirm, shiftDurationHours }: EndShiftConfirmDialogProps) {
  const { state } = useDriverSession();
  const [copySuccess, setCopySuccess] = useState(false);

  // Calculate all metrics
  const totalEarnings = (state.currentTrips || []).reduce((sum: number, trip: Trip) => sum + trip.fare + trip.tip, 0);
  const totalExpenses = (state.currentExpenses || []).reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const netEarnings = totalEarnings - totalExpenses;
  const tripCount = (state.currentTrips || []).length;

  // Calculate earning time and break time for self-employed driver
  const earningTimeHours = (state.totalEarningTimeSeconds || 0) / (60 * 60);
  const totalShiftSeconds = shiftDurationHours * 3600;
  const breakTimeHours = (totalShiftSeconds - (state.totalEarningTimeSeconds || 0)) / (60 * 60);

  // For self-employed: efficiency = earning time / total shift time (no separate working time concept)
  const efficiency = shiftDurationHours > 0 ? Math.min((earningTimeHours / shiftDurationHours) * 100, 100) : 0;

  // Fix: Use earning time for hourly rate calculation, not shift time
  const hourlyRate = earningTimeHours > 0 ? netEarnings / earningTimeHours : 0;

  // Calculate target progress
  const targetProgress = state.dailyGoal > 0 ? (netEarnings / state.dailyGoal) * 100 : 0;

  // Calculate trips to goal
  const remainingToGoal = Math.max(0, state.dailyGoal - netEarnings);
  const averageFarePerTrip = tripCount > 0 ? totalEarnings / tripCount : 15;
  const tripsToGoal = remainingToGoal > 0 ? Math.ceil(remainingToGoal / averageFarePerTrip) : 0;

  // Calculate ETA to goal
  const averageTimePerTrip = tripCount > 0 && shiftDurationHours > 0 ? (shiftDurationHours * 60) / tripCount : 45;
  const etaMinutes = tripsToGoal * averageTimePerTrip;
  const etaHours = Math.floor(etaMinutes / 60);
  const etaRemainingMinutes = Math.round(etaMinutes % 60);
  const etaDisplay = tripsToGoal > 0 ? `${etaHours}h ${etaRemainingMinutes}m` : 'Goal Reached';

  const shiftSummary = `
END SHIFT CONFIRMATION - SHIFT SUMMARY

Time Breakdown:
• Total Shift Time: ${shiftDurationHours.toFixed(1)} hours
• Earning Time: ${earningTimeHours.toFixed(1)} hours (actively on trips)
• Downtime: ${breakTimeHours.toFixed(1)} hours (waiting for trips)

1. Your Daily Target: $${state.dailyGoal.toFixed(2)}
2. Daily Target: $${state.dailyGoal.toFixed(2)}
3. Goal: $${state.dailyGoal.toFixed(2)}
4. NET EARNINGS: $${netEarnings.toFixed(2)}
5. TOTAL TRIPS: ${tripCount}
6. HOURLY RATE: $${hourlyRate.toFixed(2)}/hr (based on earning time)
7. EFFICIENCY: ${efficiency.toFixed(1)}% (earning time / total shift time)
8. TARGET PROGRESS: ${targetProgress.toFixed(1)}%
9. TRIPS TO GOAL: ${tripsToGoal}
10. ETA TO GOAL: ${etaDisplay}
11. TOTAL EXPENSES: $${totalExpenses.toFixed(2)}

Ending your shift will stop all time tracking and finalize your earnings.

Generated on: ${new Date().toLocaleString()}
  `.trim();

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shiftSummary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-sm sm:max-w-lg bg-card border border-border shadow-xl max-h-[96vh] overflow-y-auto p-4 sm:p-6" aria-describedby="end-shift-description">
        <DialogHeader className="space-y-2 mb-4">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold text-card-foreground">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-chart-4" />
            End Shift Confirmation
          </DialogTitle>
          <DialogDescription id="end-shift-description" className="text-xs sm:text-sm text-muted-foreground">
            Review your shift summary before ending
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Work Duration */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
            <p className="text-primary font-medium text-center text-sm">
              Working for <span className="font-bold">{shiftDurationHours.toFixed(1)} hours</span>
            </p>
          </div>

          {/* Key Metrics Grid - Mobile First */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-chart-2/20 border border-chart-2/30 rounded p-2">
              <div className="text-xs text-chart-2 mb-1">NET EARNINGS</div>
              <div className="font-bold text-chart-2">${netEarnings.toFixed(0)}</div>
            </div>
            <div className="bg-muted/50 border border-border rounded p-2">
              <div className="text-xs text-muted-foreground mb-1">TARGET</div>
              <div className="font-semibold text-card-foreground">${state.dailyGoal.toFixed(0)}</div>
            </div>
            <div className="bg-muted/50 border border-border rounded p-2">
              <div className="text-xs text-muted-foreground mb-1">TRIPS</div>
              <div className="font-semibold text-card-foreground">{tripCount}</div>
            </div>
            <div className="bg-muted/50 border border-border rounded p-2">
              <div className="text-xs text-muted-foreground mb-1">HOURLY</div>
              <div className="font-semibold text-card-foreground">${hourlyRate.toFixed(0)}/hr</div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="bg-muted/30 border border-border rounded-lg p-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Efficiency:</span>
                <span className="font-medium">{efficiency.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">{targetProgress.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To Goal:</span>
                <span className="font-medium">{tripsToGoal} trips</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ETA:</span>
                <span className="font-medium">{etaDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Downtime:</span>
                <span className="font-medium">{breakTimeHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-chart-1">Expenses:</span>
                <span className="font-medium text-chart-1">${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-chart-4/10 border border-chart-4/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-chart-4 mb-1">
                  Ending will stop time tracking and finalize earnings.
                </p>
                <p className="font-semibold text-chart-4 text-sm">
                  End your shift now?
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Copy Button */}
            <Button
              variant="outline"
              onClick={handleCopy}
              className="w-full h-12 flex items-center justify-center gap-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-medium"
            >
              <Copy className="w-4 h-4" />
              {copySuccess ? 'Copied!' : 'Copy Summary'}
            </Button>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-12 bg-card border border-border text-card-foreground hover:bg-muted font-medium"
              >
                Continue
              </Button>
              <Button
                onClick={handleConfirm}
                className="h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
              >
                End Shift
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
