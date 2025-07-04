import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, you'd fetch this from a database
  const settings = {
    id: 1,
    acceptingBookings: 'true', // or 'false' to test the unavailable message
    unavailableMessage: 'We are currently not accepting online bookings. Please call us to schedule a ride.',
  };
  return NextResponse.json(settings);
}
