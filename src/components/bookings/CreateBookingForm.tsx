"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollWheelTimePicker } from "@/components/ui/scroll-wheel-time-picker";
import { ScrollWheelDatePicker } from "@/components/ui/scroll-wheel-date-picker";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  User,
  DollarSign,
  CheckCircle,
  Phone,
  ArrowRight,
  ArrowLeft,
  Navigation,
  MessageCircle,
  Timer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow } from "date-fns";
import { useBookingStore } from "@/stores/bookingStore";
import { cn } from "@/lib/utils";
import type { Booking } from "@shared/schema";

interface BookingData {
  clientName: string;
  clientPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime: string;
  passengers: string;
  notes: string;
}

interface BusinessSettings {
  id: number;
  acceptingBookings: string;
  unavailableMessage: string;
}

export function CreateBookingForm() {
  const { toast } = useToast();
  const { addBooking } = useBookingStore();

  const [formData, setFormData] = useState<Partial<BookingData>>({
    passengers: "1",
    notes: "",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [businessSettings, setBusinessSettings] =
    useState<BusinessSettings | null>(null);

  const passengerOptions = ["1", "2", "3", "4", "5", "6", "7"];

  const steps = [
    {
      id: "contact",
      title: "Your Information",
      description: "Let us know who you are",
      icon: Phone,
      fields: ["clientName", "clientPhone"],
    },
    {
      id: "locations",
      title: "Trip Details",
      description: "Where would you like to go?",
      icon: MapPin,
      fields: ["pickupLocation", "dropoffLocation"],
    },
    {
      id: "datetime",
      title: "When & Who",
      description: "Choose your pickup time and party size",
      icon: Calendar,
      fields: ["scheduledDate", "scheduledTime", "passengers"],
    },
    {
      id: "confirmation",
      title: "Review & Book",
      description: "Confirm your ride details",
      icon: CheckCircle,
      fields: [],
    },
  ];

  useEffect(() => {
    const fetchBusinessSettings = async () => {
      try {
        const response = await fetch("/api/business-settings");
        if (response.ok) {
          const settings = await response.json();
          setBusinessSettings(settings);
        }
      } catch (error) {
        console.error("Failed to fetch business settings:", error);
      }
    };
    fetchBusinessSettings();
  }, []);

  const calculateFareEstimate = async (pickup?: string, dropoff?: string) => {
    if (!pickup || !dropoff) {
      setEstimatedFare(null);
      return;
    }
    try {
      const response = await fetch("/api/google-maps-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, dropoff }),
      });
      if (response.ok) {
        const data = await response.json();
        setEstimatedFare(data.fareEstimate);
      } else {
        setEstimatedFare(45); // Fallback fare
      }
    } catch (error) {
      console.error("Fare estimation failed:", error);
      setEstimatedFare(45); // Fallback fare
    }
  };

  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE, MMMM do");
  };

  const validateStep = (step: number): boolean => {
    const currentStepConfig = steps[step];
    if (!currentStepConfig) return false;

    return currentStepConfig.fields.every(field => {
      if (field === 'scheduledDate') return !!selectedDate;
      return !!formData[field as keyof BookingData];
    });
  };
  
  const isFormValid = validateStep(0) && validateStep(1) && validateStep(2);

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
    if (!isFormValid || !selectedDate) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all required fields before confirming.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData: Omit<Booking, 'id' | 'tip' | 'createdAt' | 'updatedAt'> = {
        clientName: formData.clientName!,
        clientPhone: formData.clientPhone!,
        pickupLocation: formData.pickupLocation!,
        dropoffLocation: formData.dropoffLocation!,
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
        scheduledTime: formData.scheduledTime!,
        fare: estimatedFare || 45,
        notes: `Passengers: ${formData.passengers || '1'}${formData.notes ? `. ${formData.notes}` : ''}`,
        status: 'scheduled',
      };

      await addBooking(bookingData);

      toast({
        title: 'Booking Confirmed! 🎉',
        description: `Your ride is scheduled for ${formatDateDisplay(
          selectedDate
        )} at ${formData.scheduledTime}`,
      });

      setFormData({ passengers: '1', notes: '' });
      setSelectedDate(undefined);
      setCurrentStep(0);
      setEstimatedFare(null);
    } catch (error) {
      console.error('Booking failed:', error);
      toast({
        title: 'Booking Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (businessSettings && businessSettings.acceptingBookings === 'false') {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
              <Timer className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle>Bookings Temporarily Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              {businessSettings?.unavailableMessage ||
                'Our booking system is currently offline for maintenance.'}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const currentStepConfig = steps[currentStep];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                {currentStepConfig.icon && (
                  <currentStepConfig.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                {currentStepConfig.title}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {currentStepConfig.description}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1 self-start sm:self-auto"
            >
              {`Step ${currentStep + 1}/${steps.length}`}
            </Badge>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 mt-3 sm:mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex-1 h-1.5 sm:h-2 rounded-full transition-all',
                  index <= currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="clientName"
                  className="flex items-center gap-2 text-sm sm:text-base mb-2"
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Full Name
                </Label>
                <Input
                  id="clientName"
                  placeholder="Enter your full name"
                  value={formData.clientName || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  className="h-12 text-base"
                />
              </div>
              <div>
                <Label
                  htmlFor="clientPhone"
                  className="flex items-center gap-2 text-sm sm:text-base mb-2"
                >
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                  Phone Number
                </Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="(604) 123-4567"
                  value={formData.clientPhone || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientPhone: e.target.value,
                    }))
                  }
                  className="h-12 text-base"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="pickup"
                  className="flex items-center gap-2 text-sm sm:text-base mb-2"
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  Pickup Location
                </Label>
                <Input
                  id="pickup"
                  value={formData.pickupLocation || ''}
                  onChange={(e) => {
                    const address = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      pickupLocation: address,
                    }));
                    calculateFareEstimate(address, formData.dropoffLocation);
                  }}
                  placeholder="Enter pickup address"
                  className="h-12 text-base"
                />
              </div>
              <div>
                <Label
                  htmlFor="dropoff"
                  className="flex items-center gap-2 text-sm sm:text-base mb-2"
                >
                  <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  Destination
                </Label>
                <Input
                  id="dropoff"
                  value={formData.dropoffLocation || ''}
                  onChange={(e) => {
                    const address = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      dropoffLocation: address,
                    }));
                    calculateFareEstimate(formData.pickupLocation, address);
                  }}
                  placeholder="Enter destination address"
                  className="h-12 text-base"
                />
              </div>
              {estimatedFare !== null && (
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span className="font-medium text-sm sm:text-base">
                          Estimated Fare
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-green-600">
                        ${(estimatedFare || 0).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="flex items-center gap-2 text-sm sm:text-base mb-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
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

              <div>
                <Label className="flex items-center gap-2 text-sm sm:text-base mb-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  Pickup Time
                </Label>
                <ScrollWheelTimePicker
                  value={formData.scheduledTime || ''}
                  onChange={(time) =>
                    setFormData((prev) => ({ ...prev, scheduledTime: time }))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 text-sm sm:text-base mb-2">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  Number of Passengers
                </Label>
                <RadioGroup
                  value={formData.passengers || '1'}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, passengers: value }))
                  }
                  className="grid grid-cols-4 gap-3"
                >
                  {passengerOptions.map((count) => (
                    <div key={count} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={count}
                        id={`passenger-form-${count}`}
                      />
                      <Label
                        htmlFor={`passenger-form-${count}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {count}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label
                  htmlFor="notes"
                  className="flex items-center gap-2 text-sm sm:text-base mb-2"
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or notes..."
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="min-h-[80px] text-base"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && isFormValid && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Review Your Booking
                </h3>
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
                      <p className="text-sm text-muted-foreground">
                        {formData.clientPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Date & Time
                      </p>
                      <p className="font-medium">
                        {selectedDate && formatDateDisplay(selectedDate)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.scheduledTime}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Trip Details
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">From</p>
                          <p className="text-sm text-muted-foreground">
                            {formData.pickupLocation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">To</p>
                          <p className="text-sm text-muted-foreground">
                            {formData.dropoffLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Passengers
                      </p>
                      <p className="font-medium">
                        {formData.passengers}{' '}
                        {(formData.passengers || '1') === '1'
                          ? 'Passenger'
                          : 'Passengers'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Estimated Fare
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ${(estimatedFare || 45).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {formData.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Special Requests
                        </p>
                        <p className="text-sm">{formData.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 h-12 text-base"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="flex-1 h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
                className="flex-1 h-12 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
