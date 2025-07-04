import { create } from 'zustand';
import type { Booking } from '@shared/schema';

type BookingState = {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Booking) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBooking: (id, updatedBooking) =>
    set((state) => ({
      bookings: state.bookings.map((booking) => (booking.id === id ? updatedBooking : booking)),
    })),
}));
