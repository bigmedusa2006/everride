
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDriverSession } from '@/contexts/DriverSessionContext';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart2,
  Target, 
  Plus, 
  Minus, 
  Clock,
  Wallet,
  Zap,
  Route
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function OverviewCard() {
  const { state, dispatch, getGoalEta } = useDriverSession();
  const [isProgressEnlarged, setIsProgressEnlarged] = useState(false);

  const totalEarnings = useMemo(() => 
    state.currentTrips.reduce((sum, trip) => sum + (trip.fare || 0) + (trip.tip || 0), 0)
  , [state.currentTrips]);

  const totalExpenses = useMemo(() => 
    (state.currentExpenses || []).reduce((sum, expense) => sum + (expense.amount || 0), 0)
  , [state.currentExpenses]);

  const netEarnings = totalEarnings - totalExpenses;
  const tripCount = state.currentTrips.length;
  const targetProgress = state.dailyGoal > 0 ? (netEarnings / state.dailyGoal) * 100 : 0;
  
  const shiftDurationHours = state.isShiftActive && state.shiftStartTime 
    ? (Date.now() - state.shiftStartTime) / (1000 * 60 * 60) 
    : 0;
  const hourlyRate = shiftDurationHours > 0 ? totalEarnings / shiftDurationHours : 0;

  const earningTimeHours = (state.totalEarningTimeSeconds || 0) / (60 * 60);
  const efficiency = shiftDurationHours > 0 ? Math.min((earningTimeHours / shiftDurationHours) * 100, 100) : 0;

  const remainingToGoal = Math.max(0, state.dailyGoal - netEarnings);
  const averageTripValue = tripCount > 0 ? totalEarnings / tripCount : 12;
  const tripsToGoal = remainingToGoal > 0 ? Math.ceil(remainingToGoal / averageTripValue) : 0;

  const adjustTarget = (amount: number) => {
    const newTarget = Math.max(50, Math.min(600, state.dailyGoal + amount));
    dispatch({ type: 'SET_DAILY_GOAL', payload: { goal: newTarget } });
  };

  return (
    <Card className="w-full border border-border bg-card">
      
      <div className="space-y-4 p-4 relative z-10">
        <div className="flex items-center justify-start">
          <Badge className="bg-muted/20 text-card-foreground text-sm px-3 py-1 border-0">
            <Target className="h-4 w-4 mr-1" />
            Target: ${state.dailyGoal}
          </Badge>
        </div>

        <Card 
          className="p-4 bg-muted/20 border border-border cursor-pointer hover:bg-muted/30 transition-all duration-200 active:scale-95"
          onClick={() => setIsProgressEnlarged(true)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4 text-chart-4" />
              Daily Target Progress
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 bg-muted/20 border-border text-card-foreground hover:bg-muted/40"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustTarget(-10);
                }}
                disabled={state.dailyGoal <= 50}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 bg-muted/20 border-border text-card-foreground hover:bg-muted/40"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustTarget(10);
                }}
                disabled={state.dailyGoal >= 600}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-card-foreground font-semibold">${netEarnings.toFixed(2)} / ${state.dailyGoal}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-chart-4 to-chart-4/80 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, targetProgress)}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {targetProgress.toFixed(1)}% Complete {targetProgress >= 100 && <span className="text-chart-2 font-semibold">Target achieved!</span>}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 opacity-70">
            Tap to enlarge
          </div>
        </Card>

        <Card className="p-4 bg-muted/20 border border-border ">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Route className="h-4 w-4 text-chart-3" />
            Trips to Goal
          </div>
          <div className="text-2xl font-semibold text-card-foreground">
            {tripsToGoal}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {tripsToGoal === 0 ? '🎯 Goal achieved!' : `${tripsToGoal} trips needed (avg $${averageTripValue.toFixed(2)})`}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-muted/20 border border-border ">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Wallet className="h-4 w-4 text-chart-2" />
              Net Earnings
            </div>
            <div className="text-lg font-semibold text-card-foreground">
              ${netEarnings.toFixed(2)}
            </div>
          </Card>

          <Card className="p-4 bg-muted/20 border border-border ">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <BarChart2 className="h-4 w-4" />
              Total Trips
            </div>
            <div className="text-lg font-semibold text-card-foreground">
              {tripCount}
            </div>
          </Card>
          
          <Card className="p-4 bg-muted/20 border border-border ">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Clock className="h-4 w-4 text-chart-4" />
              ETA to Goal
            </div>
            <div className="text-lg font-semibold text-card-foreground">
              {getGoalEta()}
            </div>
          </Card>

          <Card className="p-4 bg-muted/20 border border-border ">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Zap className="h-4 w-4 text-chart-2" />
              Efficiency
            </div>
            <div className="text-lg font-semibold text-card-foreground">
              {efficiency.toFixed(0)}%
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isProgressEnlarged} onOpenChange={setIsProgressEnlarged}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-chart-4" />
              Daily Target Progress
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-card-foreground">
                ${netEarnings.toFixed(2)}
              </div>
              <div className="text-lg text-muted-foreground">
                of ${state.dailyGoal} goal
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-chart-4 to-chart-4/80 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, targetProgress)}%` }}
                />
              </div>
              <div className="text-xl font-semibold text-card-foreground">
                {targetProgress.toFixed(1)}% Complete
              </div>
              {targetProgress >= 100 && (
                <div className="text-chart-2 font-semibold text-lg">
                  🎯 Target achieved!
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
                onClick={() => adjustTarget(-25)}
                disabled={state.dailyGoal <= 50}
              >
                <Minus className="h-4 w-4" />
                -$25
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
                onClick={() => adjustTarget(25)}
                disabled={state.dailyGoal >= 600}
              >
                <Plus className="h-4 w-4" />
                +$25
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
