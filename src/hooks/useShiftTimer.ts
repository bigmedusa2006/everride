'use client';
import { useDriverSession } from '@/contexts/DriverSessionContext';
import { useState, useEffect } from 'react';

export const useShiftTimer = () => {
  const { state } = useDriverSession();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentShiftTimeSeconds = () => {
    if (!state.isShiftActive || !state.shiftStartTime) return 0;
    return Math.floor((currentTime - state.shiftStartTime) / 1000);
  };

  const getTotalEarningTimeSeconds = () => {
    let earningTime = state.totalEarningTimeSeconds;
    if (state.isTripActive && state.currentTripStartTime) {
      earningTime += Math.floor((currentTime - state.currentTripStartTime) / 1000);
    }
    return earningTime;
  };
  
  const getBreakTimeRemainingSeconds = () => {
    return 0; // Placeholder
  }

  return {
    getCurrentShiftTimeSeconds,
    getTotalEarningTimeSeconds,
    getBreakTimeRemainingSeconds,
  };
};
