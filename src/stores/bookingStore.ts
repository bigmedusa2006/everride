import { create } from 'zustand';
import type { Booking } from '@shared/schema';
import { persist, createJSONStorage } from 'zustand/middleware';

type BookingState = {
  bookings: Booking[];
  isLoading: boolean;
  loadUpcomingBookings: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'tip'>) => Promise<void>;
  updateBooking: (id: string, booking: Booking) => void;
  deleteBooking: (id: string) => Promise<void>;
  completeBooking: (id: string, details: { fare: number; tip: number }) => Promise<void>;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      isLoading: true,
      loadUpcomingBookings: () => {
        set({ isLoading: true });
        // In a real app, this would fetch from a server.
        // For now, we just use what's in localStorage.
        const bookings = get().bookings;
        const upcoming = bookings
          .filter(b => {
            try {
              if (b.status === 'completed' || b.status === 'cancelled') return false;
              // Simple check to ensure date is valid before creating Date object
              if (!b.scheduledDate || !b.scheduledTime) return false;
              return new Date(`${b.scheduledDate} ${b.scheduledTime}`) >= new Date();
            } catch(e) {
              return false;
            }
          })
          .sort((a, b) => new Date(`${a.scheduledDate} ${a.scheduledTime}`).getTime() - new Date(`${b.scheduledDate} ${b.scheduledTime}`).getTime());
        set({ bookings: upcoming, isLoading: false });
      },
      addBooking: async (booking) => {
        const newBooking = { ...booking, id: crypto.randomUUID(), tip: 0 } as Booking;
        set((state) => ({
          bookings: [...state.bookings, newBooking].sort((a, b) => new Date(`${a.scheduledDate} ${a.scheduledTime}`).getTime() - new Date(`${b.scheduledDate} ${b.scheduledTime}`).getTime()),
        }));
      },
      updateBooking: (id, updatedBooking) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? updatedBooking : booking
          ),
        })),
      deleteBooking: async (id: string) => {
        set((state) => ({
            bookings: state.bookings.filter((booking) => booking.id !== id),
        }));
      },
      completeBooking: async (id: string, details: { fare: number; tip: number }) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id
              ? { ...booking, status: 'completed', fare: details.fare, tip: details.tip }
              : booking
          ),
        }));
      }
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
