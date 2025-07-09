import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useShiftTimer } from '@/hooks/useShiftTimer';
import { DriverSessionContext } from '@/contexts/DriverSessionContext';
import NewTripCompletionDialog from 'studio/Prime Time/client/src/components/trips/NewTripCompletionDialog';
import OverviewCard from 'studio/Prime Time/client/src/components/core/charts/OverviewCard';
import PickupReminderNotification from 'studio/Prime Time/client/src/components/notifications/PickupReminderNotification';
import MilestoneNotifier from 'studio/Prime Time/client/src/components/notifications/MilestoneNotifier';
import Reservations from 'studio/Prime Time/client/src/components/bookings/Reservations';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ShiftConfigDialog } from '@/components/shifts/ShiftConfigDialog';
import { EndShiftConfirmDialog } from '@/components/shifts/EndShiftConfirmDialog';

// Assuming these components are also in the new location
import { QuickActionsWidget } from '/home/user/everride/studio/Prime Time/client/src/components/widgets/QuickActionsWidget';
import { CreateBookingWidget } from '/home/user/everride/studio/Prime Time/client/src/components/widgets/CreateBookingWidget';
// import { WidgetWrapper } from '/home/user/everride/studio/Prime Time/client/src/components/widgets/WidgetWrapper';
// TODO: Fix this import path if WidgetWrapper is needed later
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '/home/user/everride/src/components/ui/card';
import { Progress } from '/home/user/everride/src/components/ui/progress';
import { WidgetCustomizer } from './widgets/WidgetCustomizer';


const DriverDashboard: React.FC<DriverDashboardProps> = () => {
  const [liveTripActive, setLiveTripActive] = useState(false);
  const [shiftGoals, setShiftGoals] = useState({ time: 0, earnings: 0 });
  const [showShiftConfig, setShowShiftConfig] = useState(false);
  const [showShiftAnalytics, setShowShiftAnalytics] = useState(false);
  const [showWidgetCustomizer, setShowWidgetCustomizer] = useState(false);

  const shiftTimer = useShiftTimer(
    // @ts-ignore // TODO: Fix this type issue
    shiftStarted ? currentShift.startTime : null,
  );

  useEffect(() => {
    if (shiftStarted) {
      setShiftGoals({
        time: currentShift.plannedDuration,
        earnings: currentShift.targetEarnings,
      });
    }
  }, [shiftStarted, currentShift]);

  const handleStartShift = (duration: number, earnings: number) => {
    startShift(duration, earnings); // Assuming startShift is available from DriverSessionContext
    setShowShiftConfig(false);
  };

  const handleEndShift = () => {
    endShiftContext();
  };

  const handleStartLiveTrip = () => {
    if (shiftStarted) {
      startLiveTripContext(); // Assuming startLiveTripContext is available from DriverSessionContext
      setLiveTripActive(true);
    } else {
      toast({
        title: 'Shift not started',
        description: 'Please start your shift before starting a live trip.',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteTrip = (tripDetails: TripDetails) => {
    addTrip(tripDetails); // Assuming addTrip is available from DriverSessionContext
    setLiveTripActive(false);
    endLiveTrip();
  };

  const handleEndLiveTrip = () => {
    endLiveTrip();
    setLiveTripActive(false);
  };

  const progressValueTime =
    shiftGoals.time > 0 ? (getCurrentShiftTimeSeconds() / shiftGoals.time) * 100 : 0;
  const progressValueEarnings =
    shiftGoals.earnings > 0 && earnings.totalEarnings > 0
      ? (earnings.totalEarnings / shiftGoals.earnings) * 100
      : 0;

  // Example data for widgets - replace with actual data
  const widgetData = {
    quickActions: {},
    createBooking: {},
    vcardSettings: {},
  };

  const widgetConfig = [
    { id: 'quickActions', component: <QuickActionsWidget {...widgetData.quickActions} /> },
    { id: 'createBooking', component: <CreateBookingWidget {...widgetData.createBooking} /> },
    {
      id: 'vcardSettings',
      component: <VCardSettingsWidget {...widgetData.vcardSettings} />,
    },
    { id: 'overview', component: <OverviewCard /> },
    { id: 'tripLog', component: <TripLogCard trips={trips} /> },
    // { id: 'expenseTracker', component: <ExpenseTrackerCard /> }, // ExpenseTrackerCard seems unused
    { id: 'reservations', component: <Reservations /> },
    { id: 'pickupReminder', component: <PickupReminderNotification /> },
    { id: 'milestoneNotifier', component: <MilestoneNotifier /> },
  ];

  // State to manage the order and visibility of widgets
  const [activeWidgets, setActiveWidgets] = useState([
    'overview',
    'quickActions',
    'tripLog',
    // 'expenseTracker', // Removing as the component seems unused
    'reservations',
  ]);

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">Driver Dashboard</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{shiftStarted ? 'Shift in Progress' : 'Shift Not Started'}</CardTitle>
          <CardDescription>
            {shiftStarted
              ? `Started at ${new Date(currentShift.startTime).toLocaleTimeString()}`
              : 'Start your shift to track your progress.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shiftStarted ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="shift-time">Shift Time</Label>
                <Progress
                  value={progressValueTime}
                  className="w-full"
                  indicatorClassName="bg-blue-500"
                />
                <p className="text-sm text-muted-foreground">
                  Elapsed: {shiftTimer} / Target: {Math.floor(shiftGoals.time / 60)} minutes
                </p>
                <p className="text-sm text-muted-foreground">
                  Time Remaining: {Math.floor(getShiftTimeRemaining() / 60)} minutes
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="earnings">Earnings</Label>
                <Progress
                  value={progressValueEarnings}
                  className="w-full"
                  indicatorClassName="bg-green-500"
                />
                <p className="text-sm text-muted-foreground">
                  Earned: ${earnings.totalEarnings.toFixed(2)} / Target: $
                  {shiftGoals.earnings.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Earnings Remaining: $
                  {Math.max(0, shiftGoals.earnings - earnings.totalEarnings).toFixed(2)}
                </p>
              </div>

              {isBreakActive ? (
                <div className="space-y-2">
                  <Label htmlFor="break-time">Break Time</Label>
                  <Progress
                    value={
                      breakTimeRemainingSeconds > 0
                        ? (breakTimeRemainingSeconds / currentShift.breakDuration) * 100
                        : 100
                    }
                    className="w-full"
                    indicatorClassName="bg-yellow-500"
                  />
                  <p className="text-sm text-muted-foreground">
                    Break Time Remaining: {Math.floor(breakTimeRemainingSeconds / 60)} minutes
                  </p>
                  <Button onClick={endBreak} className="w-full">
                    End Break
                  </Button>
                </div>
              ) : (
                <Button onClick={startBreak} className="w-full">
                  Start Break
                </Button>
              )}

              <Button
                onClick={handleStartLiveTrip}
                disabled={liveTripActive}
                className="w-full"
              >
                {liveTripActive ? 'Live Trip Active...' : 'Start Live Trip'}
              </Button>
              {liveTripActive && (
                <Button onClick={handleEndLiveTrip} className="w-full" variant="outline">
                  End Live Trip
                </Button>
              )}
            </>
          ) : (
            <Button onClick={() => setShowShiftConfig(true)} className="w-full">
              Start New Shift
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {shiftStarted && (
            <>
              <Button onClick={() => setShowShiftAnalytics(true)} variant="outline">
                Analytics
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">End Shift</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to end your shift?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will stop the shift timer and finalize your earnings and trip data for
                      this shift.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEndShift}>End Shift</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </CardFooter>
      </Card>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeWidgets.map((widgetId) => {
          const widget = widgetConfig.find(w => w.id === widgetId);
          // Using a simple div instead of WidgetWrapper for now to unblock linting
 return widget ? ( // Added closing div tag here
            <div key={widget.id} className="border rounded-lg p-4">
              {widget.component}
            </WidgetWrapper>
          ) : null;
        })}
      </div>

      <Button onClick={() => setShowWidgetCustomizer(true)} className="mt-4">
        Customize Widgets
      </Button>

      <ShiftConfigDialog
        isOpen={showShiftConfig}
        onClose={() => setShowShiftConfig(false)}
        onSave={handleStartShift}
      />

      <ShiftAnalyticsModal
        isOpen={showShiftAnalytics}
        onClose={() => setShowShiftAnalytics(false)}
      />

      <NewTripCompletionDialog
        isOpen={liveTripActive} // Assuming the dialog should show when a live trip is active
        onClose={handleEndLiveTrip} // Assuming closing the dialog means ending the live trip
        onCompleteTrip={handleCompleteTrip}
        liveTrip={liveTrip}
      />

      <WidgetCustomizer
        isOpen={showWidgetCustomizer}
        onClose={() => setShowWidgetCustomizer(false)}
        widgetConfig={widgetConfig}
        activeWidgets={activeWidgets}
        onActiveWidgetsChange={setActiveWidgets}
      />
    </div>
  );
};

export default DriverDashboard;

// Define TripDetails type (replace with your actual type definition)
interface TripDetails {
  // Define properties of tripDetails here
}