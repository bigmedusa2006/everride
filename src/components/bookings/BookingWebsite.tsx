'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollWheelTimePicker } from "@/components/ui/scroll-wheel-time-picker";
import { ScrollWheelDatePicker } from "@/components/ui/scroll-wheel-date-picker";
import {
  Car, MapPin, Calendar, Clock, Users, User,
  DollarSign, CheckCircle, Star, Shield, Phone, Award,
  Zap, ChevronDown, ArrowRight, ArrowLeft, Navigation, MessageCircle, Timer
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isTomorrow } from "date-fns";
import { useBookingStore } from '@/stores/bookingStore';
import { cn } from "@/lib/utils";
import { RideFeedback } from '@/components/feedback/RideFeedback';

interface BookingData {
  clientName: string;
  clientPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDate: string;
  scheduledTime: string;
  passengers: string;
  estimatedFare: number;
  notes: string;
}

interface BusinessSettings {
  id: number;
  acceptingBookings: string;
  unavailableMessage: string;
}

export function BookingWebsite() {
  const { toast } = useToast();
  const { addBooking } = useBookingStore();

  // Form state
  const [formData, setFormData] = useState<Partial<BookingData>>({
    passengers: '1'
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [distanceText, setDistanceText] = useState<string>('');
  const [durationText, setDurationText] = useState<string>('');
  const [calculatingFare, setCalculatingFare] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  
  // Demo feedback state
  const [showDemoFeedback, setShowDemoFeedback] = useState(false);
  const [demoBookingId, setDemoBookingId] = useState<number>(1);

  // Fare estimation function (defined before debounced ref)
  const calculateFareEstimate = async (pickup?: string, dropoff?: string) => {
    if (!pickup || !dropoff) return;
    
    setCalculatingFare(true);
    
    try {
      const response = await fetch('/api/distance-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, dropoff })
      });
      
      if (response.ok) {
        const data = await response.json();
        setEstimatedFare(data.fareEstimate);
        setDistanceText(data.distanceText);
        setDurationText(data.durationText);
        console.log(`🚗 Fare calculated: ${data.distanceText}, ${data.durationText}, $${data.fareEstimate} (${data.source})`);
      } else {
        console.error("Distance Matrix API failed:", response.status);
        setEstimatedFare(45);
        setDistanceText("~15 km");
        setDurationText("~25 min");
      }
    } catch (error) {
      console.error("Fare estimation failed:", error);
      setEstimatedFare(45);
      setDistanceText("~15 km");
      setDurationText("~25 min");
    } finally {
      setCalculatingFare(false);
    }
  };

  // Enhanced fare estimation with Google Maps fallback
  const estimateFare = (pickup: string, dropoff: string) => {
    if (pickup && dropoff) {
      // Fallback estimation while Google Maps calculates
      setEstimatedFare(45);
      setDistanceText("~15 km");
      setDurationText("~25 min");
    }
  };

  // Passenger options
  const passengerOptions = ['1', '2', '3', '4', '5', '6', '7'];

  // Booking steps
  const steps = [
    { 
      id: 'contact', 
      title: 'Your Information', 
      description: 'Let us know who you are',
      icon: Phone,
      fields: ['clientName', 'clientPhone']
    },
    { 
      id: 'locations', 
      title: 'Trip Details', 
      description: 'Where would you like to go?',
      icon: MapPin,
      fields: ['pickupLocation', 'dropoffLocation']
    },
    { 
      id: 'datetime', 
      title: 'When & Who', 
      description: 'Choose your pickup time and party size',
      icon: Calendar,
      fields: ['scheduledDate', 'scheduledTime', 'passengers']
    },
    { 
      id: 'confirmation', 
      title: 'Review & Book', 
      description: 'Confirm your ride details',
      icon: CheckCircle,
      fields: []
    }
  ];

  // Load business settings
  useEffect(() => {
    fetchBusinessSettings();
  }, []);

  // Address change handling for fare calculation
  useEffect(() => {
    if (formData.pickupLocation && formData.dropoffLocation) {
      calculateFareEstimate(formData.pickupLocation, formData.dropoffLocation);
    }
  }, [formData.pickupLocation, formData.dropoffLocation]);

  /** Fetch business settings safely */
  const fetchBusinessSettings = async () => {
    try {
      const response = await fetch('/api/business-settings');
      if (response.ok) {
        setBusinessSettings(await response.json());
      } else {
        console.warn("Failed to fetch business settings:", response.status);
      }
    } catch (error) {
      console.error("Error fetching business settings:", error);
    }
  };



  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM do');
  };

  const validateStep = (step: number): boolean => {
    const currentStepConfig = steps[step];
    if (!currentStepConfig) return false;

    const validationResults = currentStepConfig.fields.map(field => {
      const isValid = field === 'scheduledDate' ? !!selectedDate : !!formData[field as keyof BookingData];
      return isValid;
    });

    const allValid = validationResults.every(Boolean);
    return allValid;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !validateStep(2)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        clientName: formData.clientName!,
        clientPhone: formData.clientPhone!,
        pickupLocation: formData.pickupLocation!,
        dropoffLocation: formData.dropoffLocation!,
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
        scheduledTime: formData.scheduledTime!,
        fare: estimatedFare || 45,
        notes: `Passengers: ${formData.passengers || '1'}${formData.notes ? `. ${formData.notes}` : ''}`,
        status: 'scheduled'
      };

      await addBooking(bookingData as any);

      toast({
        title: "Booking Confirmed! 🎉",
        description: `Your ride is scheduled for ${formatDateDisplay(selectedDate)} at ${formData.scheduledTime}`,
      });

      // Reset form
      setFormData({ passengers: '1' });
      setSelectedDate(undefined);
      setCurrentStep(0);
      setEstimatedFare(null);

    } catch (error) {
      console.error('Booking failed:', error);
      
      if (error instanceof Error && error.message.includes('conflict')) {
        toast({
          title: "Time Slot Unavailable",
          description: "This time conflicts with an existing booking. Please choose a different time that's at least 1 hour away from other bookings.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Booking Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (businessSettings?.acceptingBookings === 'false') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <Timer className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle>Bookings Temporarily Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              {businessSettings?.unavailableMessage || 'Our booking system is currently offline for maintenance.'}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Mobile-First Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="mx-auto px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Car className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Everride™</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Professional Transportation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-1 sm:flex">
                <Star className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">5-Star Service</span>
                <span className="sm:hidden">5⭐</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Mobile-First Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Book Your Ride</h2>
              <p className="text-blue-100 text-base mb-6">
                Skip the surge pricing! Direct booking with professional service.
              </p>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  No Hidden Fees
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4" />
                  Fixed Pricing
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4" />
                  500+ Trips
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Mobile-First Booking Form */}
          <Card>
            <CardHeader className="pb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  {currentStep === 0 && <Phone className="h-6 w-6 text-blue-600" />}
                  {currentStep === 1 && <MapPin className="h-6 w-6 text-blue-600" />}
                  {currentStep === 2 && <Calendar className="h-6 w-6 text-blue-600" />}
                  {currentStep === 3 && <CheckCircle className="h-6 w-6 text-blue-600" />}
                  <CardTitle className="text-xl">
                    {steps[currentStep].title}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {steps[currentStep].description}
                </p>
                <Badge variant="secondary" className="text-xs px-3 py-1">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
              </div>

              {/* Mobile-Optimized Progress Indicator */}
              <div className="flex items-center gap-2 mt-6">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "flex-1 h-2 rounded-full transition-all duration-300",
                      index <= currentStep 
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500" 
                        : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                {/* Step 1: Contact Information - Mobile Optimized */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="clientName" className="flex items-center gap-3 text-base mb-3 font-medium">
                        <User className="h-5 w-5 text-blue-600" />
                        Full Name
                      </Label>
                      <Input
                        id="clientName"
                        placeholder="Enter your full name"
                        value={formData.clientName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="h-14 text-lg px-4 rounded-xl border-2 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone" className="flex items-center gap-3 text-base mb-3 font-medium">
                        <Phone className="h-5 w-5 text-blue-600" />
                        Phone Number
                      </Label>
                      <Input
                        id="clientPhone"
                        type="tel"
                        placeholder="(604) 123-4567"
                        value={formData.clientPhone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="h-14 text-lg px-4 rounded-xl border-2 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Locations - Mobile Optimized */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="pickup" className="flex items-center gap-3 text-base mb-3 font-medium">
                        <MapPin className="h-5 w-5 text-green-500" />
                        Pickup Location
                      </Label>
                      <Input
                        id="pickup"
                        placeholder="Enter pickup address (e.g., Downtown Vancouver)"
                        value={formData.pickupLocation || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                        className="h-14 text-lg px-4 rounded-xl border-2 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dropoff" className="flex items-center gap-3 text-base mb-3 font-medium">
                        <Navigation className="h-5 w-5 text-red-500" />
                        Destination
                      </Label>
                      <Input
                        id="dropoff"
                        placeholder="Enter destination address (e.g., YVR Airport)"
                        value={formData.dropoffLocation || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                        className="h-14 text-lg px-4 rounded-xl border-2 focus:border-red-500"
                      />
                    </div>
                    
                    {estimatedFare && (
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                        <CardContent className="p-5">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-base">Estimated Fare</span>
                              {calculatingFare && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              )}
                            </div>
                            <div className="text-3xl font-bold text-green-600">
                              ${estimatedFare}
                            </div>
                            {(distanceText || durationText) && (
                              <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
                                {distanceText && (
                                  <div className="flex items-center gap-1">
                                    <Navigation className="h-3 w-3" />
                                    {distanceText}
                                  </div>
                                )}
                                {durationText && (
                                  <div className="flex items-center gap-1">
                                    <Timer className="h-3 w-3" />
                                    {durationText}
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              Fixed pricing, no surge fees
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Step 3: Date, Time, Passengers - Mobile Optimized */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* iPhone-Style Date Picker */}
                    <div>
                      <Label className="flex items-center gap-3 text-base mb-3 font-medium">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Pickup Date
                      </Label>
                      <ScrollWheelDatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        className="w-full"
                        minDate={new Date()}
                        maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                      />
                    </div>

                    {/* iPhone-Style Time Picker */}
                    <div>
                      <Label className="flex items-center gap-3 text-base mb-3 font-medium">
                        <Clock className="h-5 w-5 text-orange-500" />
                        Pickup Time
                      </Label>
                      <ScrollWheelTimePicker
                        value={formData.scheduledTime || ''}
                        onChange={(time) => setFormData(prev => ({ ...prev, scheduledTime: time }))}
                        className="w-full"
                      />
                    </div>

                    {/* Passenger Picker */}
                    <div>
                      <Label className="flex items-center gap-3 text-base mb-3 font-medium">
                        <Users className="h-5 w-5 text-purple-500" />
                        Number of Passengers
                      </Label>
                      <RadioGroup
                        value={formData.passengers || '1'}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, passengers: value }))}
                        className="grid grid-cols-4 gap-4"
                      >
                        {passengerOptions.map((count) => (
                          <div key={count} className="flex items-center space-x-2">
                            <RadioGroupItem value={count} id={`passenger-${count}`} />
                            <Label 
                              htmlFor={`passenger-${count}`} 
                              className="text-base font-medium cursor-pointer"
                            >
                              {count}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Special Notes */}
                    <div>
                      <Label htmlFor="notes" className="flex items-center gap-3 text-base mb-3 font-medium">
                        <MessageCircle className="h-5 w-5 text-green-500" />
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special requests or notes for your driver..."
                        value={formData.notes || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="min-h-[100px] text-lg px-4 py-3 rounded-xl border-2 focus:border-green-500 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Review Your Booking</h3>
                      <p className="text-muted-foreground">
                        Please confirm all details are correct before booking
                      </p>
                    </div>

                    <Card className="bg-gray-50 dark:bg-gray-800/50">
                      <CardContent className="p-6 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Passenger</p>
                            <p className="font-medium">{formData.clientName}</p>
                            <p className="text-sm text-muted-foreground">{formData.clientPhone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date & Time</p>
                            <p className="font-medium">
                              {selectedDate && formatDateDisplay(selectedDate)}
                            </p>
                            <p className="text-sm text-muted-foreground">{formData.scheduledTime}</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Trip Details</p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">From</p>
                                <p className="text-sm text-muted-foreground">{formData.pickupLocation}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Navigation className="h-4 w-4 text-red-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">To</p>
                                <p className="text-sm text-muted-foreground">{formData.dropoffLocation}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Passengers</p>
                            <p className="font-medium">{formData.passengers} {formData.passengers === '1' ? 'Passenger' : 'Passengers'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Estimated Fare</p>
                            <p className="text-2xl font-bold text-green-600">
                              ${estimatedFare || 45}
                            </p>
                          </div>
                        </div>

                        {formData.notes && (
                          <>
                            <Separator />
                            <div>
                              <p className="text-sm text-muted-foreground">Special Requests</p>
                              <p className="text-sm">{formData.notes}</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Mobile-Optimized Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="flex-1 h-16 text-lg font-medium rounded-xl border-2"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!validateStep(currentStep)}
                      className="flex-1 h-16 text-lg font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !validateStep(2)}
                      className="flex-1 h-16 text-lg font-medium rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                      <CheckCircle className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

          {/* Mobile-First Trust Indicators */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="font-bold text-indigo-700 dark:text-indigo-300 text-lg">Why Choose Everride?</h3>
                <p className="text-sm text-muted-foreground mt-2">Professional transportation you can trust</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">No surge pricing ever</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Fixed airport fares</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">5-star rated service</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Professional drivers only</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Feedback Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                <Star className="h-5 w-5" />
                Try Our One-Click Feedback System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Experience our innovative emoji-based feedback system that makes sharing your ride experience as simple as one tap.
                </p>
                <Button 
                  onClick={() => setShowDemoFeedback(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Demo Feedback System
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Feedback Dialog */}
      <RideFeedback
        bookingId={demoBookingId.toString()}
        open={showDemoFeedback}
        onOpenChange={setShowDemoFeedback}
        onSubmitted={() => {
          setShowDemoFeedback(false);
          toast({
            title: "Demo Complete!",
            description: "Your feedback has been saved to our system.",
          });
        }}
      />
    </div>
  );
}
