'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Clock, Target } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  pickupReminders: boolean;
  pickupReminderTime: number; // minutes before pickup
  pickupReminderSound: boolean;
  performanceMilestones: boolean;
  milestoneTypes: {
    dailyEarnings: boolean;
    tripCount: boolean;
    hoursWorked: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  pickupReminders: true,
  pickupReminderTime: 30,
  pickupReminderSound: true,
  performanceMilestones: true,
  milestoneTypes: {
    dailyEarnings: true,
    tripCount: true,
    hoursWorked: true,
  },
};

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      const savedPrefs = JSON.parse(saved);
      // Merge with defaults to ensure all keys are present, even if new ones are added later
      setPreferences({ 
        ...defaultPreferences, 
        ...savedPrefs,
        milestoneTypes: {
          ...defaultPreferences.milestoneTypes,
          ...savedPrefs.milestoneTypes,
        }
      });
    }
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
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Manage how and when you receive alerts from the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pickup Reminders Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pickup Reminders
          </h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="pickup-reminders" className="font-normal text-muted-foreground">Enable Pickup Reminders</Label>
            <Switch
              id="pickup-reminders"
              checked={preferences.pickupReminders}
              onCheckedChange={(checked) => updatePreference('pickupReminders', checked)}
            />
          </div>
          {preferences.pickupReminders && (
            <div className="space-y-4 pt-4 border-t mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Reminder Time</Label>
                <Select
                  value={String(preferences.pickupReminderTime)}
                  onValueChange={(value) => updatePreference('pickupReminderTime', parseInt(value, 10))}
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
              <div className="flex items-center justify-between pt-4 border-t">
                <Label htmlFor="pickup-reminder-sound" className="font-normal text-muted-foreground flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Enable Sound Alert
                </Label>
                <Switch
                  id="pickup-reminder-sound"
                  checked={!!preferences.pickupReminderSound}
                  onCheckedChange={(checked) => updatePreference('pickupReminderSound', checked)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Performance Milestones Section */}
        <div className="space-y-4 rounded-lg border p-4">
           <h3 className="text-base font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Performance Milestones
          </h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="performance-milestones" className="font-normal text-muted-foreground">Enable Milestone Notifications</Label>
            <Switch
              id="performance-milestones"
              checked={preferences.performanceMilestones}
              onCheckedChange={(checked) => updatePreference('performanceMilestones', checked)}
            />
          </div>
          {preferences.performanceMilestones && (
            <div className="space-y-3 pt-4 border-t mt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-earnings" className="text-sm text-muted-foreground">Daily Earnings Goals</Label>
                <Switch
                  id="daily-earnings"
                  checked={preferences.milestoneTypes.dailyEarnings}
                  onCheckedChange={(checked) => updateMilestoneType('dailyEarnings', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="trip-count" className="text-sm text-muted-foreground">Trip Count Achievements</Label>
                <Switch
                  id="trip-count"
                  checked={preferences.milestoneTypes.tripCount}
                  onCheckedChange={(checked) => updateMilestoneType('tripCount', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hours-worked" className="text-sm text-muted-foreground">Hours Worked Milestones</Label>
                <Switch
                  id="hours-worked"
                  checked={preferences.milestoneTypes.hoursWorked}
                  onCheckedChange={(checked) => updateMilestoneType('hoursWorked', checked)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
