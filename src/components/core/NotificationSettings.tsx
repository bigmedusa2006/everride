
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Target, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import { NotificationDemo } from './NotificationDemo';

interface NotificationPreferences {
  pickupReminders: boolean;
  pickupReminderTime: number; // minutes before pickup
  shiftTimeAlerts: boolean;
  shiftBreakReminders: boolean;
  performanceMilestones: boolean;
  milestoneTypes: {
    dailyEarnings: boolean;
    tripCount: boolean;
    hoursWorked: boolean;
  };
  soundEnabled: boolean;
  browserNotifications: boolean;
  customSounds: boolean;
}

const defaultPreferences: NotificationPreferences = {
  pickupReminders: true,
  pickupReminderTime: 30,
  shiftTimeAlerts: true,
  shiftBreakReminders: true,
  performanceMilestones: true,
  milestoneTypes: {
    dailyEarnings: true,
    tripCount: true,
    hoursWorked: true,
  },
  soundEnabled: true,
  browserNotifications: true,
  customSounds: false,
};

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isTestingSound, setIsTestingSound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Initialize notification service
    notificationService.initialize();
  }, []);

  const savePreferences = (newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
    
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Automatically enable browser notifications when permission is granted
        const newPreferences = { ...preferences, browserNotifications: true };
        savePreferences(newPreferences);
        
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive browser notifications for pickups and shift alerts.",
        });
      } else {
        toast({
          title: "Notifications Denied",
          description: "Browser notifications won't work. You can still use sound alerts.",
          variant: "destructive",
        });
      }
    }
  };

  const testSound = async () => {
    setIsTestingSound(true);
    try {
      // Use the notification service's pickup alert sound
      await notificationService.initialize();
      // Trigger a test sound by creating a temporary audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
      toast({
        title: "Test Sound Played",
        description: "This is how pickup alerts will sound.",
      });
    } catch (error) {
      toast({
        title: "Sound Test Failed",
        description: "Audio playback may not be available.",
        variant: "destructive",
      });
    }
    
    setTimeout(() => setIsTestingSound(false), 1000);
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Prime Rides Test', {
        body: 'This is how pickup reminders will appear!',
        icon: '/logo.png',
        badge: '/logo.png',
      });
      
      toast({
        title: "Test Notification Sent",
        description: "Check your system notifications!",
      });
    } else {
      toast({
        title: "Permission Required",
        description: "Please enable browser notifications first.",
        variant: "destructive",
      });
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    savePreferences(newPreferences);
  };

  const updateMilestoneType = (type: keyof NotificationPreferences['milestoneTypes'], value: boolean) => {
    const newPreferences = {
      ...preferences,
      milestoneTypes: {
        ...preferences.milestoneTypes,
        [type]: value,
      },
    };
    savePreferences(newPreferences);
  };

  // Quick enable all notifications
  const enableAllNotifications = async () => {
    // First request permission
    if (notificationPermission !== 'granted') {
      await requestNotificationPermission();
    }
    
    // Enable all notification features
    const allEnabledPreferences = {
      ...preferences,
      pickupReminders: true,
      shiftTimeAlerts: true,
      shiftBreakReminders: true,
      performanceMilestones: true,
      milestoneTypes: {
        dailyEarnings: true,
        tripCount: true,
        hoursWorked: true,
      },
      soundEnabled: true,
      browserNotifications: true,
    };
    savePreferences(allEnabledPreferences);
    
    toast({
      title: "All Notifications Enabled",
      description: "Pickup reminders, shift alerts, and performance milestones are now active!",
    });
  };

  return (
    <div className="space-y-4 text-sm">
      {/* Quick Enable Section */}
      {notificationPermission !== 'granted' && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Enable Notifications for Full Experience
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Get pickup reminders, shift alerts, and performance milestones
                </p>
              </div>
              <Button onClick={enableAllNotifications} className="bg-blue-600 hover:bg-blue-700">
                Enable All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Browser Notifications Permission */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Browser Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Notification Permission</Label>
              <p className="text-xs text-muted-foreground">
                Required for pickup alerts and reminders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={notificationPermission === 'granted' ? 'default' : 'destructive'}>
                {notificationPermission === 'granted' ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {notificationPermission === 'granted' ? 'Enabled' : 'Disabled'}
              </Badge>
              {notificationPermission !== 'granted' && (
                <Button size="sm" onClick={requestNotificationPermission}>
                  Enable
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="browser-notifications" className="text-sm font-medium">
                Browser Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Show system notifications for important alerts
              </p>
            </div>
            <Switch
              id="browser-notifications"
              checked={preferences.browserNotifications}
              onCheckedChange={(checked) => updatePreference('browserNotifications', checked)}
              disabled={notificationPermission !== 'granted'}
            />
          </div>

          <Button size="sm" variant="outline" onClick={testNotification} className="w-full">
            Test Browser Notification
          </Button>
        </CardContent>
      </Card>

      {/* Pickup Reminders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pickup Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="pickup-reminders" className="text-sm font-medium">
                Enable Pickup Reminders
              </Label>
              <p className="text-xs text-muted-foreground">
                Get notified before scheduled pickups
              </p>
            </div>
            <Switch
              id="pickup-reminders"
              checked={preferences.pickupReminders}
              onCheckedChange={(checked) => updatePreference('pickupReminders', checked)}
            />
          </div>

          {preferences.pickupReminders && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Reminder Time</Label>
              <Select
                value={preferences.pickupReminderTime.toString()}
                onValueChange={(value) => updatePreference('pickupReminderTime', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="45">45 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shift Time Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Shift Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="shift-alerts" className="text-sm font-medium">
                Shift Time Alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Alerts for shift start, end, and overtime
              </p>
            </div>
            <Switch
              id="shift-alerts"
              checked={preferences.shiftTimeAlerts}
              onCheckedChange={(checked) => updatePreference('shiftTimeAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="break-reminders" className="text-sm font-medium">
                Break Reminders
              </Label>
              <p className="text-xs text-muted-foreground">
                Remind to take breaks during long shifts
              </p>
            </div>
            <Switch
              id="break-reminders"
              checked={preferences.shiftBreakReminders}
              onCheckedChange={(checked) => updatePreference('shiftBreakReminders', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Milestones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Performance Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="performance-milestones" className="text-sm font-medium">
                Enable Milestone Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Celebrate achievements and targets
              </p>
            </div>
            <Switch
              id="performance-milestones"
              checked={preferences.performanceMilestones}
              onCheckedChange={(checked) => updatePreference('performanceMilestones', checked)}
            />
          </div>

          {preferences.performanceMilestones && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Milestone Types</Label>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily-earnings" className="text-xs">Daily Earnings Goals</Label>
                  <Switch
                    id="daily-earnings"
                    checked={preferences.milestoneTypes.dailyEarnings}
                    onCheckedChange={(checked) => updateMilestoneType('dailyEarnings', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="trip-count" className="text-xs">Trip Count Achievements</Label>
                  <Switch
                    id="trip-count"
                    checked={preferences.milestoneTypes.tripCount}
                    onCheckedChange={(checked) => updateMilestoneType('tripCount', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="hours-worked" className="text-xs">Hours Worked Milestones</Label>
                  <Switch
                    id="hours-worked"
                    checked={preferences.milestoneTypes.hoursWorked}
                    onCheckedChange={(checked) => updateMilestoneType('hoursWorked', checked)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sound-enabled" className="text-sm font-medium">
                Sound Alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Play audio alerts for notifications
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => updatePreference('soundEnabled', checked)}
            />
          </div>

          {preferences.soundEnabled && (
            <Button
              size="sm"
              variant="outline"
              onClick={testSound}
              disabled={isTestingSound}
              className="w-full"
            >
              {isTestingSound ? 'Playing...' : 'Test Sound Alert'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Notification Testing */}
      <NotificationDemo />
    </div>
  );
}
