
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Target, Settings, CheckCircle, AlertCircle, Music } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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
  browserNotifications: boolean;
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
  browserNotifications: true,
};

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
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
        const newPreferences = { ...preferences, browserNotifications: true };
        savePreferences(newPreferences);
        
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive browser notifications for pickups and shift alerts.",
        });
      } else {
        toast({
          title: "Notifications Denied",
          description: "Browser notifications won't work without permission.",
          variant: "destructive",
        });
      }
    }
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

  return (
    <div className="space-y-4 text-sm">
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
              <Label className="text-sm font-medium">Permission Status</Label>
              <p className="text-xs text-muted-foreground">
                Required for all browser alerts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={notificationPermission === 'granted' ? 'default' : 'destructive'}>
                {notificationPermission === 'granted' ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {notificationPermission}
              </Badge>
              {notificationPermission !== 'granted' && (
                <Button size="sm" onClick={requestNotificationPermission}>
                  Request
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="browser-notifications" className="text-sm font-medium">
                Enable All Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Master switch for system notifications
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
            Send Test Notification
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Music className="h-4 w-4" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
                Personalize the audio alerts for different in-app events to create your ideal work environment.
            </p>
            <Button asChild className="w-full">
                <Link href="/settings/sounds">
                    Customize Sounds
                </Link>
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pickup Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="pickup-reminders" className="text-sm font-medium">
              Enable Pickup Reminders
            </Label>
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
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Performance Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="performance-milestones" className="text-sm font-medium">
              Enable Milestone Notifications
            </Label>
            <Switch
              id="performance-milestones"
              checked={preferences.performanceMilestones}
              onCheckedChange={(checked) => updatePreference('performanceMilestones', checked)}
            />
          </div>

          {preferences.performanceMilestones && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-earnings" className="text-xs">Daily Earnings Goals</Label>
                <Switch
                  id="daily-earnings"
                  checked={preferences.milestoneTypes.dailyEarnings}
                  onCheckedChange={(checked) => updateMilestoneType('dailyEarnings', checked)}
                  size="sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="trip-count" className="text-xs">Trip Count Achievements</Label>
                <Switch
                  id="trip-count"
                  checked={preferences.milestoneTypes.tripCount}
                  onCheckedChange={(checked) => updateMilestoneType('tripCount', checked)}
                  size="sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hours-worked" className="text-xs">Hours Worked Milestones</Label>
                <Switch
                  id="hours-worked"
                  checked={preferences.milestoneTypes.hoursWorked}
                  onCheckedChange={(checked) => updateMilestoneType('hoursWorked', checked)}
                  size="sm"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
