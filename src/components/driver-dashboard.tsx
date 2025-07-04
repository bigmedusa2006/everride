'use client';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
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
import { ShiftSummaryDialog } from "@/components/shifts/ShiftSummaryDialog"
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

import { ExpenseTrackerCard } from "@/components/expenses/ExpenseTrackerCard" // Import ExpenseTrackerCard
import { PickupReminderNotification } from "@/components/notifications/PickupReminderNotification"

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
  const [showShiftSummary, setShowShiftSummary] = useState(false)
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

  useEffect(() => {
    if (state.lastShiftSummary && state.isShiftCompleted) {
      setShowShiftSummary(true);
    }
  }, [state.lastShiftSummary, state.isShiftCompleted]);

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
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative z-10 safe-area-top safe-area-bottom">
        <Tabs defaultValue="dashboard" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5 m-2 mb-0 h-14 mobile-touch-target bg-card/90 border-0 shadow-lg">
            <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 text-xs h-12 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20 mobile-tab">
              <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] font-medium">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex flex-col items-center gap-1 text-xs h-12 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20 mobile-tab">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] font-medium">Reservations</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex flex-col items-center gap-1 text-xs h-12 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20 mobile-tab">
              <Receipt className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] font-medium">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex flex-col items-center gap-1 text-xs h-12 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20 mobile-tab">
              <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] font-medium">Manual</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col items-center gap-1 text-xs h-12 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20 mobile-tab">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] font-medium">Settings</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mobile-scroll">

            <TabsContent value="dashboard" className="space-y-2 p-2 m-0 bg-background text-foreground mobile-padding">
              {/* Dashboard Sub-tabs - Mobile Optimized */}
              <Tabs defaultValue="shift-clock" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-3 h-12 mobile-touch-target bg-card/80 border-0 shadow-md">
                  <TabsTrigger value="shift-clock" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <Timer className="h-4 w-4 mr-1" />
                    <span className="font-medium">Clock</span>
                  </TabsTrigger>
                  <TabsTrigger value="trip-log" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <Route className="h-4 w-4 mr-1" />
                    <span className="font-medium">Trips</span>
                  </TabsTrigger>
                  <TabsTrigger value="daily-target" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <Target className="h-4 w-4 mr-1" />
                    <span className="font-medium">Target</span>
                  </TabsTrigger>
                  <TabsTrigger value="earnings-history" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">History</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="shift-clock" className="mt-0">
                  {/* Shift Clock - Mobile-Optimized */}
              <Card className="m-2 border-0 relative overflow-hidden bg-card/80 shadow-lg">
                {/* Decorative accent circles */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-accent/40 to-accent/50 rounded-full opacity-80 blur-sm"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-accent/50 to-accent/60 rounded-full opacity-60 blur-sm"></div>

                {!state.isShiftActive && !state.isShiftCompleted ? (
                  // Pre-shift state - only show Start New Shift button
                  <>
                    <CardHeader className="pb-3 relative z-10">
                      <div className="text-center mb-2">
                        <h1 className="text-card-foreground text-lg font-bold">Prime Rides™</h1>
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
                  // Active shift state - show full controls
                  <>
                    <CardHeader className="pb-3 relative z-10">
                      <div className="text-center mb-2">
                        <h1 className="text-card-foreground text-lg font-bold">Prime Rides™</h1>
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
                      {/* Timer Display - Clickable for Analytics */}
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
                        {/* Earning Time - Top, Bigger, Visible */}
                        <div className="text-center">
                          <div className="text-3xl font-mono font-bold text-card-foreground mb-1">
                            {formatTime(getTotalEarningTimeSeconds())}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">Earning Time</div>
                        </div>

                        {/* Shift Time - Bottom, Smaller, Green */}
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

                        {/* Subtle visual hint that it's clickable */}
                        <div className="mt-2 text-center">
                          <div className="text-xs text-muted-foreground/70 italic">Tap for detailed analytics</div>
                        </div>
                      </div>

                      {/* Driving Efficiency - Also clickable */}
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

                      {/* Action Buttons */}
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
                  {/* Daily Target Dashboard */}
                  <OverviewCard />
                </TabsContent>

                <TabsContent value="trip-log" className="mt-0">
                  {/* Trip Log */}
                  <TripLogCard />
                </TabsContent>

                <TabsContent value="earnings-history" className="mt-0">
                  <EarningsHistoryCard />
                </TabsContent>
              </Tabs>
              </TabsContent>

            <TabsContent value="bookings" className="space-y-2 p-2 m-0 bg-background text-foreground mobile-padding">
              {/* Private Bookings - Professional Chauffeur Services */}
              <PrivateBookingsCard />
            </TabsContent>


            <TabsContent value="expenses" className="space-y-2 p-2 m-0 bg-background text-foreground mobile-padding">
              {/* Expenses Sub-tabs - Mobile Optimized */}
              <Tabs defaultValue="recent-expenses" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3 h-12 mobile-touch-target bg-card/80 border-0 shadow-md">
                  <TabsTrigger value="recent-expenses" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <Receipt className="h-4 w-4 mr-1" />
                    <span className="font-medium">Recent</span>
                  </TabsTrigger>
                  <TabsTrigger value="add-expenses" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="font-medium">Add New</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent-expenses" className="mt-0">
                  {/* Recent Expenses */}
                  <RecentExpensesCard />
                </TabsContent>

                <TabsContent value="add-expenses" className="mt-0">
                  {/* Add Expenses */}
                  <ExpenseTrackerCard />
                </TabsContent>
              </Tabs>
              </TabsContent>

            <TabsContent value="manual" className="space-y-2 p-2 m-0 bg-background text-foreground mobile-padding">
              {/* User Guide - Comprehensive Manual */}
              <Card className="m-2 border border-border bg-card">
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-card-foreground text-lg font-bold">Prime Rides™ Manual</CardTitle>
                  <p className="text-sm text-muted-foreground">Complete guide to using your driver dashboard</p>
                </CardHeader>
                <CardContent className="relative z-10 p-4">
                  <UserGuide />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-2 p-2 m-0 bg-background text-foreground mobile-padding">
              {/* Settings Sub-tabs - Mobile Optimized */}
              <Tabs defaultValue="theme" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-3 h-12 mobile-touch-target bg-card/80 border-0 shadow-md">
                  <TabsTrigger value="theme" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <Settings className="h-4 w-4 mr-1" />
                    <span className="font-medium">Theme</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="font-medium">Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger value="about" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    <span className="font-medium">About</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="text-xs h-10 mobile-touch-target text-card-foreground data-[state=active]:text-accent data-[state=active]:bg-accent/20">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="font-medium">Data</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="theme" className="mt-0">
                  {/* Quick Theme Toggle */}
                  <Card className="m-2 border border-border bg-card">
                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-card-foreground text-lg font-bold">Quick Theme</CardTitle>
                        <QuickThemeToggle asIcon={false} />
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Advanced Theme Settings */}
                  <Card className="m-2 border border-border bg-card">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-card-foreground text-lg font-bold">Advanced Theme Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 p-4">
                      <ThemeSettings />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <Card className="m-2 border border-border bg-card">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-card-foreground text-lg font-bold">Notification Settings</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                    </CardHeader>
                    <CardContent className="relative z-10 p-4">
                      <NotificationSettings />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="about" className="mt-0">
                  {/* About Information */}
                  <Card className="m-2 border border-border bg-card">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-card-foreground text-lg font-bold">About Prime Rides™</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 p-4">
                      <div className="space-y-4 text-sm">
                        <div>
                          <h3 className="font-semibold text-card-foreground mb-2">Application Information</h3>
                          <p className="text-muted-foreground text-xs mb-2">
                            Prime Rides™ is a comprehensive driver dashboard designed for professional ride services and chauffeur operations.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-card-foreground mb-2">Features</h3>
                          <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                            <li>• Shift time tracking and management</li>
                            <li>• AI-powered booking system</li>
                            <li>• Expense tracking and categorization</li>
                            <li>• Real-time earnings calculations</li>
                            <li>• Professional business card generation</li>
                            <li>• Performance analytics and reporting</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-card-foreground mb-2">Technology</h3>
                          <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                            <li>• Progressive Web App (PWA) enabled</li>
                            <li>• Mobile-first responsive design</li>
                            <li>• Real-time data synchronization</li>
                            <li>• Offline capability with local storage</li>
                          </ul>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground text-center">
                            For comprehensive usage instructions, visit the <strong>Manual</strong> tab.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="mt-0">
                  {/* Data Management */}
                  <Card className="m-2 border border-border bg-card">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-card-foreground text-lg font-bold">Data Management</CardTitle>
                      <p className="text-sm text-muted-foreground">Export, backup, restore, and manage your data</p>
                    </CardHeader>
                    <CardContent className="relative z-10 p-4">
                      <div className="space-y-4">
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Data management features coming soon
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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

        {state.lastShiftSummary && (
          <ShiftSummaryDialog
            open={showShiftSummary}
            onClose={() => setShowShiftSummary(false)}
            onConfirmClose={() => {
              dispatch({ type: 'CLEAR_SUMMARY' });
              setShowShiftSummary(false);
            }}
            summaryData={state.lastShiftSummary}
          />
        )}

        <NewTripCompletionDialog
          open={showFareEntry}
          onOpenChange={setShowFareEntry}
          booking={null}
        />

        <ShiftAnalyticsModal
          open={showShiftAnalytics}
          onOpenChange={setShowShiftAnalytics}
        />

        {/* Pickup Reminder Notification System */}
        <PickupReminderNotification />
      </div>
    </div>
  )
}
