'use client';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  Clock, 
  DollarSign, 
  BarChart3,
  Activity
} from "lucide-react"
import { useDriverSession } from "@/contexts/DriverSessionContext"
import { useShiftTimer } from "@/hooks/useShiftTimer"
import { formatTime } from "@/lib/formatTime"
import { useMemo } from "react"
import { Badge } from "../ui/badge";

interface ShiftAnalyticsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShiftAnalyticsModal({ open, onOpenChange }: ShiftAnalyticsModalProps) {
  const { state } = useDriverSession();
  const { 
    getCurrentShiftTimeSeconds,
    getTotalEarningTimeSeconds,
    getDrivingEfficiency,
    getNetHourlyRate 
  } = useShiftTimer();

  // Calculate current shift stats using the hook
  const shiftTimeSeconds = getCurrentShiftTimeSeconds();
  const earningTimeSeconds = getTotalEarningTimeSeconds();
  const downtimeSeconds = shiftTimeSeconds - earningTimeSeconds;
  const efficiency = getDrivingEfficiency();
  const hourlyRate = getNetHourlyRate();
  
  const tripStats = useMemo(() => {
    const trips = state.currentTrips;
    if (trips.length === 0) return null;

    const totalFares = trips.reduce((sum, trip) => sum + (trip.fare || 0), 0);
    const totalTips = trips.reduce((sum, trip) => sum + (trip.tip || 0), 0);
    const avgFare = totalFares / trips.length;
    const avgTip = totalTips / trips.length;
    const bestTrip = Math.max(...trips.map(trip => (trip.fare || 0) + (trip.tip || 0)));
    const avgTripDuration = trips.reduce((sum, trip) => sum + (trip.durationSeconds || 0), 0) / trips.length;

    return {
      totalTrips: trips.length,
      avgFare: avgFare,
      avgTip: avgTip,
      bestTrip: bestTrip,
      avgDuration: avgTripDuration,
      totalEarnings: totalFares + totalTips
    };
  }, [state.currentTrips]);

  const lastTripPrice = useMemo(() => {
    const trips = state.currentTrips;
    if (trips.length === 0) return 0;
    const lastTrip = trips[trips.length - 1];
    return (lastTrip.fare || 0) + (lastTrip.tip || 0);
  }, [state.currentTrips]);
  
  const netEarnings = state.totalEarningsThisShift - state.totalExpensesThisShift;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-4 sm:p-6 bg-background">
        <DialogTitle className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 flex items-center justify-center gap-2">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
          Shift Analytics & Performance
        </DialogTitle>

        <div className="space-y-6">
          {/* Time Breakdown Card */}
          <Card className="bg-card shadow-sm border-border">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-4 pb-2">
              <Clock className="h-5 w-5 text-chart-4" />
              <CardTitle className="text-base font-semibold">Time Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Shift</span>
                <span className="font-mono font-medium text-foreground">{formatTime(shiftTimeSeconds)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Earning Time</span>
                <span className="font-mono font-medium text-chart-2">{formatTime(earningTimeSeconds)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Downtime</span>
                <span className="font-mono font-medium text-destructive">{formatTime(downtimeSeconds)}</span>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Efficiency</span>
                  <span className="font-semibold text-foreground">{efficiency}%</span>
                </div>
                <div className="w-full bg-chart-4/20 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-chart-4 to-chart-2 h-2 rounded-full"
                        style={{ width: `${efficiency}%` }}
                    />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings Overview Card */}
          <Card className="bg-card shadow-sm border-border">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-4 pb-2">
              <DollarSign className="h-5 w-5 text-chart-2" />
              <CardTitle className="text-base font-semibold">Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Earnings</span>
                <span className="font-medium text-chart-2">${state.totalEarningsThisShift.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-medium text-destructive">${state.totalExpensesThisShift.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Net Earnings</span>
                <span className="font-semibold text-foreground">${netEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-medium text-chart-4">${hourlyRate.toFixed(2)}/hr</span>
              </div>
              <div className="border-t border-border/50 pt-4 mt-2">
                 <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last Trip Price</span>
                  <div className="text-right">
                    <span className="font-medium text-chart-2">${lastTripPrice > 0 ? lastTripPrice.toFixed(2) : '0.00'}</span>
                    {lastTripPrice > 0 && 
                      <p className="text-xs text-muted-foreground">Most recent earnings</p>
                    }
                  </div>
                 </div>
              </div>
            </CardContent>
          </Card>
          
           {/* Trip Performance Card */}
          {tripStats && (
            <Card className="bg-card shadow-sm border-border">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-4 pb-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Trip Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Trips</span>
                  <Badge variant="secondary">{tripStats.totalTrips}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Avg. Fare</span>
                  <span className="font-medium text-foreground">${tripStats.avgFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Avg. Tip</span>
                  <span className="font-medium text-foreground">${tripStats.avgTip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Best Trip</span>
                  <span className="font-medium text-chart-2">${tripStats.bestTrip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Avg. Duration</span>
                  <span className="font-mono text-foreground">{formatTime(tripStats.avgDuration)}</span>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
