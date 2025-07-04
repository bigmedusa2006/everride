
'use client';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Car, 
  Timer, 
  DollarSign, 
  Ban,
  Power,
  LocateFixed,
  Wallet,
  BarChart2,
  Zap,
  Wrench, 
  TrendingUp,
  CircleDollarSign,
  Clock,
  Plus,
  PlusCircle,
  Trash2,
  Target,
  AlertTriangle,
  MapPin,
  Route,
  QrCode,
  X,
  Circle,
  LayoutDashboard,
  Calendar,
  Receipt,
  Settings,
  HelpCircle,
  FileText
} from "lucide-react"
import { useDriverSession } from "@/contexts/DriverSessionContext"
import { ThemeSettings, QuickThemeToggle } from "@/components/core/ThemeSettings"
import { UserGuide } from "@/components/core/UserGuide"
import { NotificationSettings } from "@/components/core/NotificationSettings"


import { ShiftConfigDialog, type ShiftConfig } from "@/components/shifts/ShiftConfigDialog"
import { ShiftExtensionDialog } from "@/components/shifts/ShiftExtensionDialog"
import { EndShiftConfirmDialog } from "@/components/shifts/EndShiftConfirmDialog"
import { NewTripCompletionDialog } from "@/components/trips/NewTripCompletionDialog"

import { OverviewCard } from "@/components/core/charts/OverviewCard"
import RecentExpensesCard from "@/components/expenses/RecentExpensesCard"
import TripLogCard from "@/components/trips/TripLogCard"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { ExpenseCategoryDropdown } from "@/components/core/forms/ExpenseCategoryDropdown"
import { PrivateBookingsCard } from "@/components/bookings/Reservations"
import { RecordedFareCard } from "@/components/trips/RecordedFareCard"
import { VCard } from "@/components/business/VCard"

import { ExpenseTrackerCard } from "@/components/expenses/ExpenseTrackerCard" 
import { PickupReminderNotification } from "@/components/notifications/PickupReminderNotification"
import { MilestoneNotifier } from '@/components/notifications/MilestoneNotifier';

import { formatTime } from "@/lib/formatTime"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

import { ShiftAnalyticsModal } from "@/components/shifts/ShiftAnalyticsModal"
import { EarningsDataTable } from '@/components/earnings/EarningsDataTable'
import { EarningsHistoryCard } from '@/components/earnings/EarningsHistoryCard'
import { useBookingStore } from '@/stores/bookingStore';
import { WidgetCustomizer } from '@/components/widgets/WidgetCustomizer';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { CreateBookingWidget } from '@/components/widgets/CreateBookingWidget';
import { QuickActionsWidget } from '@/components/widgets/QuickActionsWidget';
import { BusinessSettingsWidget } from '@/components/business/VCardSettingsWidget';
import { useShiftTimer } from '@/hooks/useShiftTimer';
import { ThemeToggle } from "@/components/theme-toggle";


// ... Component implementation will be added here
export function DriverDashboard() {
  const { 
    state, 
    dispatch, 
    startLiveTrip: contextStartLiveTrip, 
    endShift: contextEndShift
  } = useDriverSession()

  const {
    getCurrentShiftTimeSeconds,
    getTotalEarningTimeSeconds: getEarningTimeFromHook,
  } = useShiftTimer();

  // Calculate real-time earning time including active trip
  const getTotalEarningTimeSeconds = () => {
    if (state.isTripActive && state.currentTripStartTime) {
      return state.totalEarningTimeSeconds + Math.floor((currentTime - state.currentTripStartTime) / 1000);
    }
    return state.totalEarningTimeSeconds || 0;
  };

  const getDrivingEfficiency = () => {
    if (!state.shiftStartTime) return null;
    const totalShiftSeconds = getCurrentShiftTimeSeconds();
    const earningSeconds = getEarningTimeFromHook();
    return totalShiftSeconds > 0 ? Math.round((earningSeconds / totalShiftSeconds) * 100) : 0;
  };

  // State for dialogs
  const [showShiftConfig, setShowShiftConfig] = useState(false)
  const [showEndShiftConfirm, setShowEndShiftConfirm] = useState(false)
  const [showShiftAnalytics, setShowShiftAnalytics] = useState(false)

  const [showFareEntry, setShowFareEntry] = useState(false)

  // Timer state
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Trip management functions
  const handleEndShift = () => {
    contextEndShift()
    setShowEndShiftConfirm(false)
  }

  const handleStartShift = (config: ShiftConfig) => {
    dispatch({
      type: 'START_SHIFT',
      payload: {
        startTime: Date.now(),
        dailyGoal: config.dailyGoal,
        durationHours: config.plannedDurationHours,
        driverName: config.driverName
      }
    })
  }
  
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <MilestoneNotifier />
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative z-10">
        <Tabs defaultValue="dashboard" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5 bg-card border-b h-16 px-2">
            <TabsTrigger value="dashboard" className="flex flex-col items-center justify-center gap-1 text-xs h-full data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground transition-colors duration-150 ease-in-out">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex flex-col items-center justify-center gap-1 text-xs h-full data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground transition-colors duration-150 ease-in-out">
              <Calendar className="h-5 w-5" />
              <span>Reservations</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex flex-col items-center justify-center gap-1 text-xs h-full data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground transition-colors duration-150 ease-in-out">
              <Receipt className="h-5 w-5" />
              <span>Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex flex-col items-center justify-center gap-1 text-xs h-full data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground transition-colors duration-150 ease-in-out">
              <HelpCircle className="h-5 w-5" />
              <span>Manual</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col items-center justify-center gap-1 text-xs h-full data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground transition-colors duration-150 ease-in-out">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-2">

            <TabsContent value="dashboard" className="space-y-2 m-0">
              <Tabs defaultValue="shift-clock" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-3 h-12 bg-muted border-0 shadow-inner">
                  <TabsTrigger value="shift-clock" className="text-xs h-10 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Timer className="h-4 w-4 mr-1" />
                    <span className="font-medium">Clock</span>
                  </TabsTrigger>
                  <TabsTrigger value="trip-log" className="text-xs h-10 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Route className="h-4 w-4 mr-1" />
                    <span className="font-medium">Trips</span>
                  </TabsTrigger>
                  <TabsTrigger value="daily-target" className="text-xs h-10 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Target className="h-4 w-4 mr-1" />
                    <span className="font-medium">Target</span>
                  </TabsTrigger>
                  <TabsTrigger value="earnings-history" className="text-xs h-10 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">History</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="shift-clock" className="mt-0">
                  <Card className="border-0 relative overflow-hidden bg-card/80 shadow-lg">
                    {!state.isShiftActive ? (
                      <>
                        <CardHeader className="pb-3 relative z-10">
                          <div className="text-center mb-2">
                            <h1 className="text-card-foreground text-lg font-bold">Everride™</h1>
                          </div>
                          <div className="flex justify-center">
                            <Badge className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1">
                              <Power className="h-3 w-3 mr-1" />
                              Off
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 text-center relative z-10">
                          <Button 
                            className="w-full h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-bold text-base"
                            onClick={() => setShowShiftConfig(true)}
                          >
                            <Car className="h-6 w-6 mr-3" />
                            Start Shift
                          </Button>
                        </CardContent>
                      </>
                    ) : (
                      <>
                        <CardHeader className="pb-3 relative z-10">
                          <div className="text-center mb-2">
                            <h1 className="text-card-foreground text-lg font-bold">Everride™</h1>
                          </div>
                          <div className="flex justify-center">
                            <Badge className={`${
                              state.isTripActive ? 'bg-chart-2' : 'bg-primary'
                            } text-primary-foreground text-xs rounded-full px-2 py-1 relative`}>
                              <LocateFixed className="h-3 w-3 mr-1 animate-pulse" />
                              {state.isTripActive ? 'Trip' : 'Active'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10 p-4">
                          <div 
                            className="bg-muted/20 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors duration-200 active:scale-[0.98] transform"
                            onClick={() => setShowShiftAnalytics(true)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setShowShiftAnalytics(true)
                              }
                            }}
                          >
                            <div className="text-center">
                              <div className="text-3xl font-mono font-bold text-card-foreground mb-1">
                                {formatTime(getTotalEarningTimeSeconds())}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wider">Earning Time</div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-border text-center">
                              <div className="text-lg font-mono font-bold text-chart-2">
                                {state.isShiftActive && state.shiftStartTime ? 
                                  formatTime(getCurrentShiftTimeSeconds()) : 
                                  '00:00'
                                }
                              </div>
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <div className="text-xs text-muted-foreground">Shift Time</div>
                                {state.plannedShiftDurationHours && (
                                  <Badge className="bg-chart-4/80 text-chart-4 text-xs px-2 py-1 rounded-full">
                                    {state.plannedShiftDurationHours}h Shift
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 text-center">
                              <div className="text-xs text-muted-foreground/70 italic">Tap for detailed analytics</div>
                            </div>
                          </div>
                          <div 
                            className="bg-muted/20 p-3 border border-border cursor-pointer hover:bg-muted/30 transition-colors duration-200 active:scale-[0.98] transform"
                            onClick={() => setShowShiftAnalytics(true)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setShowShiftAnalytics(true)
                              }
                            }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-chart-2" />
                                <span className="text-sm text-card-foreground">Efficiency</span>
                              </div>
                              <span className="text-sm font-bold text-chart-2">
                                {getDrivingEfficiency() || 0}%
                              </span>
                            </div>
                            <Progress 
                              value={Math.min(getDrivingEfficiency() || 0, 100)} 
                              className="h-2 bg-muted"
                            />
                            <div className="text-xs text-muted-foreground/70 italic text-center mt-1">
                              Tap for analytics
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Button 
                              className="h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold text-base"
                              onClick={() => {
                                if (!state.isTripActive) {
                                  contextStartLiveTrip()
                                } else {
                                  setShowFareEntry(true)
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {!state.isTripActive ? <Car className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
                                <span className="text-lg">{!state.isTripActive ? "Start" : "End"}</span>
                              </div>
                            </Button>
                            <Button 
                              variant="outline" 
                              className="h-12 bg-muted/20 border-border text-card-foreground hover:bg-muted/40 font-bold text-base disabled:opacity-50"
                              onClick={() => {
                                if (state.isTripActive) {
                                  toast({
                                    title: "Cannot End Shift",
                                    description: "Please complete or cancel the current trip before ending your shift.",
                                    variant: "destructive",
                                  })
                                  return
                                }
                                if (state.isShiftActive) {
                                  setShowEndShiftConfirm(true)
                                }
                              }}
                              disabled={state.isTripActive}
                            >
                              <div className="flex items-center gap-3">
                                <Clock className="h-6 w-6" />
                                <span className="text-lg">{state.isTripActive ? 'Active' : 'End Shift'}</span>
                              </div>
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="daily-target" className="mt-0">
                  <OverviewCard />
                </TabsContent>

                <TabsContent value="trip-log" className="mt-0">
                  <TripLogCard />
                </TabsContent>

                <TabsContent value="earnings-history" className="mt-0">
                  <EarningsHistoryCard />
                </TabsContent>
              </Tabs>
              </TabsContent>

            <TabsContent value="bookings" className="space-y-2 m-0">
              <PrivateBookingsCard />
            </TabsContent>

            <TabsContent value="expenses" className="space-y-2 m-0">
              <Tabs defaultValue="recent-expenses" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3 h-12 bg-muted">
                  <TabsTrigger value="recent-expenses" className="text-xs h-10 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Receipt className="h-4 w-4 mr-1" />
                    <span className="font-medium">Recent</span>
                  </TabsTrigger>
                  <TabsTrigger value="add-expenses" className="text-xs h-10 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="font-medium">Add New</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent-expenses" className="mt-0">
                  <RecentExpensesCard />
                </TabsContent>

                <TabsContent value="add-expenses" className="mt-0">
                  <ExpenseTrackerCard />
                </TabsContent>
              </Tabs>
              </TabsContent>

            <TabsContent value="manual" className="space-y-2 m-0">
              <Card className="border border-border bg-card">
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-card-foreground text-lg font-bold">Everride™ Manual</CardTitle>
                  <p className="text-sm text-muted-foreground">Complete guide to using your driver dashboard</p>
                </CardHeader>
                <CardContent className="relative z-10 p-4">
                  <UserGuide />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 p-2 m-0">
               <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ThemeSettings />
                </CardContent>
              </Card>

              <NotificationSettings />

            </TabsContent>
          </div>
        </Tabs>

        {/* All Dialogs */}
        <ShiftConfigDialog
          open={showShiftConfig}
          onOpenChange={setShowShiftConfig}
          onStartShift={handleStartShift}
        />

        <ShiftExtensionDialog
          open={state.shiftExtensionOffered}
          onExtend={() => {
            const currentTotalHours = (state.plannedShiftDurationHours || 0) + state.extendedShiftHours;
            const extensionHours = Math.min(2, 13 - currentTotalHours);
            if (extensionHours > 0) {
              dispatch({ type: 'ACCEPT_EXTENSION', payload: { hours: extensionHours } });
            }
          }}
          onDecline={() => {
            dispatch({ type: 'DECLINE_EXTENSION' });
            contextEndShift();
          }}
          currentHours={(state.plannedShiftDurationHours || 0) + state.extendedShiftHours}
          maxAllowedHours={13}
        />

        <EndShiftConfirmDialog
          open={showEndShiftConfirm}
          onOpenChange={setShowEndShiftConfirm}
          onConfirm={handleEndShift}
          shiftDurationHours={state.isShiftActive && state.shiftStartTime ? 
            (currentTime - state.shiftStartTime) / (1000 * 60 * 60) : 0
          }
        />

        <NewTripCompletionDialog
          open={showFareEntry}
          onOpenChange={setShowFareEntry}
        />

        <ShiftAnalyticsModal
          open={showShiftAnalytics}
          onOpenChange={setShowShiftAnalytics}
        />

        <PickupReminderNotification />
      </div>
    </div>
  )
}
