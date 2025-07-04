
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  Receipt, 
  Settings, 
  Phone, 
  MessageCircle,
  BarChart3,
  Plus,
  Play,
  Square,
  Power,
  Calculator,
  FileText,
  Smartphone,
  Zap,
  Shield,
  HelpCircle
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  content: React.ReactNode;
}

export function UserGuide() {
  const [openSections, setOpenSections] = useState<string[]>(['overview']);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const guideSections: GuideSection[] = [
    {
      id: 'overview',
      title: 'Getting Started',
      icon: <Car className="h-4 w-4" />,
      badge: 'Essential',
      content: (
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Welcome to Everride™ - your comprehensive driver dashboard for managing rides, tracking earnings, and optimizing your business.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick Start Checklist:</h4>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200 text-xs">
              <li>• Start your shift to begin tracking time and trips</li>
              <li>• Use the booking system for scheduled rides</li>
              <li>• Log completed trips for accurate earnings tracking</li>
              <li>• Track expenses to optimize your profit margins</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'shifts',
      title: 'Shift Management',
      icon: <Clock className="h-4 w-4" />,
      badge: 'Core Feature',
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Play className="h-3 w-3 text-green-600" />
                Starting a Shift
              </h4>
              <p className="text-muted-foreground mb-2">Click "Start Shift" and select your planned duration:</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• 4 hours - Short shift</li>
                <li>• 8 hours - Standard shift</li>
                <li>• 12 hours - Extended shift (BC Commercial Vehicle Rules Apply)</li>
                <li>• Custom - Set your own duration</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Square className="h-3 w-3 text-red-600" />
                Ending a Shift
              </h4>
              <p className="text-muted-foreground text-xs">
                Click "End Shift" to stop tracking and view your shift summary with earnings, expenses, and performance metrics.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                <strong>Important:</strong> BC Commercial Vehicle Rules require mandatory rest periods after 12-hour shifts.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bookings',
      title: 'Booking System',
      icon: <Calendar className="h-4 w-4" />,
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Creating Bookings</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Click "Add Booking" to create scheduled rides</li>
                <li>• Enter pickup/destination addresses</li>
                <li>• Set date, time, and passenger details</li>
                <li>• Get instant fare estimates with Google Maps integration</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Manual Booking Creation</h4>
              <p className="text-muted-foreground text-xs mb-2">
                Create bookings using the step-by-step booking form:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Enter client name and contact information</li>
                <li>• Set pickup and destination addresses</li>
                <li>• Schedule date and time for the trip</li>
                <li>• Set agreed fare and special notes</li>
              </ul>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs font-mono mt-2">
                Use "Create Booking" tab for new scheduled trips
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Managing Bookings</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• View upcoming rides in the Bookings tab</li>
                <li>• Swipe left to delete bookings</li>
                <li>• Tap to edit details or mark as completed</li>
                <li>• Share estimates with customers via WhatsApp</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'trips',
      title: 'Trip Logging',
      icon: <MapPin className="h-4 w-4" />,
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Recording Completed Trips</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Use "Log Trip" to record walk-in customers</li>
                <li>• Enter pickup/destination addresses</li>
                <li>• Record fare amount and tip received</li>
                <li>• Add trip duration for performance tracking</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Fare Calculator</h4>
              <p className="text-muted-foreground text-xs mb-2">
                Get accurate fare estimates using:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Google Maps distance calculation</li>
                <li>• Time-based pricing for traffic conditions</li>
                <li>• Automatic fare suggestions</li>
                <li>• Manual override for special rates</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 text-xs">
                <strong>Pro Tip:</strong> Record trips immediately after completion for accurate earnings tracking.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'expenses',
      title: 'Expense Tracking',
      icon: <Receipt className="h-4 w-4" />,
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Quick Expense Buttons</h4>
              <p className="text-muted-foreground text-xs mb-2">Pre-configured buttons for common expenses:</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Tim Hortons: Coffee, meals, snacks</li>
                <li>• 7-Eleven: Drinks and convenience items</li>
                <li>• Chipotle: Meal expenses</li>
                <li>• Gas stations and vehicle maintenance</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Manual Expense Entry</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Select from organized categories (Food, Vehicle, etc.)</li>
                <li>• Enter custom amounts and descriptions</li>
                <li>• Track date and time automatically</li>
                <li>• View recent expenses in real-time</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Expense Categories</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <p className="font-medium">Food & Drink</p>
                  <p className="font-medium">Vehicle Expenses</p>
                  <p className="font-medium">Work Tools</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Personal & Wellness</p>
                  <p className="font-medium">Finance & Admin</p>
                  <p className="font-medium">Miscellaneous</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: <BarChart3 className="h-4 w-4" />,
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Overview Dashboard</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Real-time earnings and expense tracking</li>
                <li>• Trip count and average fare calculations</li>
                <li>• Profit margins and hourly earnings</li>
                <li>• Visual charts for performance trends</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Shift Analytics</h4>
              <p className="text-muted-foreground text-xs mb-2">
                Detailed performance metrics including:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Total earnings vs. expenses</li>
                <li>• Average trip duration and fare</li>
                <li>• Peak hour performance</li>
                <li>• Efficiency ratings and recommendations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Earnings History</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Searchable and sortable trip records</li>
                <li>• Filter by date, fare amount, or destination</li>
                <li>• Export data for tax purposes</li>
                <li>• Monthly and weekly summaries</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: 'Customization',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Theme Customization</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Light/Dark mode toggle</li>
                <li>• Multiple color themes (Blue, Green, Orange, etc.)</li>
                <li>• Border radius customization</li>
                <li>• Real-time preview of changes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Interface Preferences</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Customize tab layout and organization</li>
                <li>• Adjust font sizes and display density</li>
                <li>• Configure quick action buttons</li>
                <li>• Personal workflow optimization</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mobile',
      title: 'Mobile Optimization',
      icon: <Smartphone className="h-4 w-4" />,
      badge: 'PWA Ready',
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Progressive Web App</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Install on your phone like a native app</li>
                <li>• Works offline with cached data</li>
                <li>• Fast loading and smooth performance</li>
                <li>• Automatic updates when online</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Touch-Friendly Interface</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Swipe gestures for quick actions</li>
                <li>• Large touch targets for easy tapping</li>
                <li>• Optimized keyboard layouts</li>
                <li>• Responsive design for all screen sizes</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 text-xs">
                <strong>Installation:</strong> Tap "Add to Home Screen" in your browser menu to install the app.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips',
      title: 'Pro Tips & Best Practices',
      icon: <Zap className="h-4 w-4" />,
      badge: 'Expert',
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Maximizing Earnings</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Track peak hours to optimize your schedule</li>
                <li>• Use booking system for guaranteed rides</li>
                <li>• Monitor your hourly rate in real-time</li>
                <li>• Keep expense ratios below 30% for healthy profit</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Efficient Workflow</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Log trips immediately after completion</li>
                <li>• Use quick expense buttons during breaks</li>
                <li>• Set up pickup reminders 30 minutes early</li>
                <li>• Review daily summaries to spot trends</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Customer Service</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Share accurate fare estimates before pickup</li>
                <li>• Send confirmation messages with arrival times</li>
                <li>• Keep contact information easily accessible</li>
                <li>• Use professional booking confirmations</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <HelpCircle className="h-4 w-4" />,
      content: (
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Common Issues</h4>
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-xs">Data not saving:</p>
                  <p className="text-muted-foreground text-xs ml-2">• Check your internet connection</p>
                  <p className="text-muted-foreground text-xs ml-2">• Refresh the page and try again</p>
                </div>

                <div>
                  <p className="font-medium text-xs">App running slowly:</p>
                  <p className="text-muted-foreground text-xs ml-2">• Clear browser cache</p>
                  <p className="text-muted-foreground text-xs ml-2">• Close other browser tabs</p>
                </div>

                <div>
                  <p className="font-medium text-xs">Booking form issues:</p>
                  <p className="text-muted-foreground text-xs ml-2">• Check all required fields are filled</p>
                  <p className="text-muted-foreground text-xs ml-2">• Verify date and time are valid</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Data Recovery</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Most data is automatically backed up</li>
                <li>• Check recent expenses tab for missing entries</li>
                <li>• Refresh the page to sync latest data</li>
                <li>• Contact support if data appears lost</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-xs">
                <strong>Emergency Reset:</strong> If the app becomes unresponsive, clear your browser data and reload.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">


      <div className="space-y-3">
        {guideSections.map((section) => (
          <Card key={section.id} className="border border-border">
            <Collapsible 
              open={openSections.includes(section.id)} 
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/40">
                        {section.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-card-foreground text-base">
                          {section.title}
                        </CardTitle>
                        {section.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {section.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                        openSections.includes(section.id) ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 pb-4">
                  {section.content}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-2">
            Need Additional Help?
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
            For technical support or feature requests, contact the development team.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="h-3 w-3" />
              Contact Support
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-3 w-3" />
              Report Issue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
