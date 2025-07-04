'use client';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  DollarSign, 
  Activity, 
  BarChart3,
  Target
} from "lucide-react"
import { useDriverSession } from "@/contexts/DriverSessionContext"
import { useShiftTimer } from "@/hooks/useShiftTimer"
import { formatTime } from "@/lib/formatTime"
import { useMemo } from "react"

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
      <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogTitle className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 flex items-center justify-center gap-2">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Shift Analytics & Performance
        </DialogTitle>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Time Breakdown */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Time Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Total Shift</span>
                <span className="font-mono font-bold text-sm sm:text-base">{formatTime(shiftTimeSeconds)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Earning Time</span>
                <span className="font-mono font-bold text-chart-2 text-sm sm:text-base">{formatTime(earningTimeSeconds)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Downtime</span>
                <span className="font-mono font-bold text-chart-4 text-sm sm:text-base">{formatTime(downtimeSeconds)}</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span>Efficiency</span>
                  <span className="font-bold">{efficiency}%</span>
                </div>
                <Progress value={efficiency} className="h-2 sm:h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Earnings Overview */}
          <Card className="bg-gradient-to-br from-chart-2/5 to-chart-2/10">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-chart-2" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Total Earnings</span>
                <span className="font-bold text-chart-2 text-sm sm:text-base">${state.totalEarningsThisShift.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Total Expenses</span>
                <span className="font-bold text-chart-1 text-sm sm:text-base">${state.totalExpensesThisShift.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Net Earnings</span>
                <span className="font-bold text-sm sm:text-base">${netEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Hourly Rate</span>
                <span className="font-bold text-primary text-sm sm:text-base">${hourlyRate.toFixed(2)}/hr</span>
              </div>
              <div className="pt-2 border-t border-border/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Last Trip Price</span>
                  <div className="relative">
                    <span 
                      className={`font-bold text-chart-2 text-sm sm:text-base transition-all duration-300 ${
                        lastTripPrice > 0 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-70 scale-95'
                      }`}
                      style={{
                        animation: lastTripPrice > 0 ? 'flash-update 0.6s ease-out' : 'none'
                      }}
                      key={lastTripPrice}
                    >
                      {lastTripPrice > 0 ? `$${lastTripPrice.toFixed(2)}` : '—'}
                    </span>
                    {lastTripPrice > 0 && (
                      <div 
                        className="absolute inset-0 bg-chart-2/20 rounded blur-sm -z-10"
                        style={{
                          animation: 'glow-fade 1s ease-out'
                        }}
                      />
                    )}
                  </div>
                </div>
                {lastTripPrice > 0 && (
                  <div className="text-xs text-muted-foreground mt-1 text-right animate-in fade-in duration-300">
                    Most recent earnings
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trip Performance */}
          {tripStats && (
            <Card className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 lg:col-span-1 xl:col-span-1">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-chart-3" />
                  Trip Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Total Trips</span>
                  <Badge variant="secondary" className="text-xs sm:text-sm">{tripStats.totalTrips}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Avg Fare</span>
                  <span className="font-bold text-sm sm:text-base">${tripStats.avgFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Avg Tip</span>
                  <span className="font-bold text-sm sm:text-base">${tripStats.avgTip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Best Trip</span>
                  <span className="font-bold text-chart-2 text-sm sm:text-base">${tripStats.bestTrip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Avg Duration</span>
                  <span className="font-mono text-xs sm:text-sm">{formatTime(tripStats.avgDuration)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Goals & Targets */}
        <Card className="lg:col-span-2 xl:col-span-3">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Daily Progress & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm">Daily Target Progress</span>
                  <span className="text-xs sm:text-sm font-bold">
                    ${netEarnings.toFixed(2)} / ${state.dailyGoal.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={state.dailyGoal > 0 ? Math.min((netEarnings / state.dailyGoal) * 100, 100) : 0} 
                  className="h-2 sm:h-3 mb-2"
                />
                <div className="text-xs text-muted-foreground">
                  {netEarnings >= state.dailyGoal 
                    ? "🎉 Daily target achieved!" 
                    : `$${(state.dailyGoal - netEarnings).toFixed(2)} remaining`
                  }
                </div>
              </div>

              {state.plannedShiftDurationHours && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm">Shift Time Progress</span>
                    <span className="text-xs sm:text-sm font-bold">
                      {formatTime(shiftTimeSeconds)} / {state.plannedShiftDurationHours + state.extendedShiftHours}h
                    </span>
                  </div>
                  <Progress 
                    value={state.plannedShiftDurationHours > 0 ? Math.min((shiftTimeSeconds / ((state.plannedShiftDurationHours + state.extendedShiftHours) * 3600)) * 100, 100) : 0} 
                    className="h-2 sm:h-3 mb-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {shiftTimeSeconds >= ((state.plannedShiftDurationHours + state.extendedShiftHours) * 3600)
                      ? "Planned shift duration completed"
                      : `${formatTime(((state.plannedShiftDurationHours + state.extendedShiftHours) * 3600) - shiftTimeSeconds)} remaining`
                    }
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
