export type BookingStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export type Booking = {
  id: string;
  clientName: string;
  clientPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDate: string;
  scheduledTime: string;
  fare: number;
  tip: number;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};
