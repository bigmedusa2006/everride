import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";
import { db } from "./firebase"; // Corrected import path based on previous actions

interface Booking extends DocumentData {
  id?: string; // Add id as optional since it's added after creation
  // Define the properties of a booking here
  name: string;
  // Add other properties as needed
}

// Add booking
async function createBooking(newBooking: Omit<Booking, 'id'>): Promise<Booking> {
  const docRef = await addDoc(collection(db, "bookings"), newBooking);
  return { id: docRef.id, ...newBooking } as Booking;
}

// Fetch bookings
async function getAllBookings(): Promise<Booking[]> {
  const snapshot = await getDocs(collection(db, "bookings"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
}

export { createBooking, getAllBookings };