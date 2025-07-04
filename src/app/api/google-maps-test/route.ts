import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pickup, dropoff } = await request.json();

    if (!pickup || !dropoff) {
      return NextResponse.json({ error: 'Pickup and dropoff locations are required' }, { status: 400 });
    }

    // In a real app, you would use the Google Maps Distance Matrix API
    // For now, we'll return a mock fare estimate
    const fareEstimate = Math.floor(Math.random() * (100 - 30 + 1)) + 30;

    return NextResponse.json({ fareEstimate });
  } catch (error) {
    console.error('Fare estimation error:', error);
    return NextResponse.json({ error: 'Failed to estimate fare' }, { status: 500 });
  }
}
