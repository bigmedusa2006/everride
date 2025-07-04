import { create } from 'zustand';
import type { Booking } from '@shared/schema';
import { persist, createJSONStorage } from 'zustand/middleware';

type BookingState = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, booking: Booking) => void;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (booking) =>
        set((state) => ({
          bookings: [{ ...booking, id: crypto.randomUUID() } as Booking, ...state.bookings].sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()),
        })),
      updateBooking: (id, updatedBooking) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? updatedBooking : booking
          ),
        })),
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
