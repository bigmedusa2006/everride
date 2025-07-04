import { create } from 'zustand';
import type { Booking } from '@shared/schema';
import { persist, createJSONStorage } from 'zustand/middleware';

type BookingState = {
  bookings: Booking[];
  isLoading: boolean;
  loadUpcomingBookings: () => void;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  updateBooking: (id: string, booking: Booking) => void;
  deleteBooking: (id: string) => Promise<void>;
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
              return new Date(`${b.scheduledDate} ${b.scheduledTime}`) >= new Date();
            } catch(e) {
              return false;
            }
          })
          .sort((a, b) => new Date(`${a.scheduledDate} ${a.scheduledTime}`).getTime() - new Date(`${b.scheduledDate} ${b.scheduledTime}`).getTime());
        set({ bookings: upcoming, isLoading: false });
      },
      addBooking: async (booking) => {
        const newBooking = { ...booking, id: crypto.randomUUID() } as Booking;
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
      }
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
