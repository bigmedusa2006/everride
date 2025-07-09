
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Car, MapPin, Trash2, DollarSign, Edit3 } from 'lucide-react';
import { useDriverSession } from '@/contexts/DriverSessionContext';
import type { Trip } from '@/contexts/DriverSessionContext';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export default function TripLogCard() {
  const { state, dispatch } = useDriverSession();
  const currentTrips = state.currentTrips;
  const { toast } = useToast();
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  const handleDeleteTrip = (tripId: string) => {
    try {
      dispatch({ type: 'REMOVE_TRIP', payload: tripId });
      toast({
        title: "Trip Deleted",
        description: "Trip removed from your log",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDesignation = (tripId: string, newDesignation: 'prime' | 'platform') => {
    try {
      const trip = currentTrips.find(t => t.id === tripId);
      if (trip) {
        dispatch({ 
          type: 'UPDATE_TRIP', 
          payload: { ...trip, designationType: newDesignation }
        });
      }
      setEditingTripId(null);
      toast({
        title: "Trip Type Updated",
        description: `Trip changed to ${newDesignation === 'prime' ? 'Prime Trip' : 'Platform Trip'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update trip type",
        variant: "destructive",
      });
    }
  };

  const totalEarnings = currentTrips.reduce((sum: number, trip: any) => sum + (trip.fare || 0) + (trip.tip || 0), 0);
  const totalTrips = currentTrips.length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg text-card-foreground">
              Trip Log
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Complete record of all your trips
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {currentTrips.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">No trips recorded yet</h3>
            <p className="text-sm">Start your shift and log trips to see them here</p>
          </div>
        ) : (
          <>
            {/* Trip Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">{totalTrips}</span>
                  <p className="text-xs text-muted-foreground">Total Trips</p>
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-center">
                  <span className="text-2xl font-bold text-chart-2">${totalEarnings.toFixed(2)}</span>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </div>

            {/* Trip List */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-card-foreground">
                Trip History
              </h4>
              
              {[...currentTrips].reverse().map((trip: Trip, index: number) => (
                <div
                  key={trip.id}
                  className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Trip Header */}
                      <div className="flex items-center gap-2 mb-2">
                        {/* Trip Designation Badge */}
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant="outline"
                            className={`text-xs transition-all duration-200 ${
                              trip.designationType === 'prime' 
                                ? 'border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-300' 
                                : 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {trip.designationType === 'prime' ? 'Prime Trip' : 'Platform Trip'}
                          </Badge>
                          
                          {/* Edit Designation Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleUpdateDesignation(trip.id, 'prime')}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                  Prime Trip
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateDesignation(trip.id, 'platform')}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  Platform Trip
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(trip.startTime || Date.now()).toLocaleDateString()} at{' '}
                          {new Date(trip.startTime || Date.now()).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>

                      {/* Trip Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {trip.durationSeconds > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {Math.round(trip.durationSeconds / 60)}m
                            </div>
                          )}
                          
                          {(trip.fare || trip.tip) && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${((trip.fare || 0) + (trip.tip || 0)).toFixed(2)}
                              {trip.tip > 0 && (
                                <span className="text-chart-2">
                                  (${trip.fare.toFixed(2)} + ${trip.tip.toFixed(2)} tip)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="ml-2 h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
