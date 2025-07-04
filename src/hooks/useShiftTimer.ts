'use client';
import { useEffect, useCallback, useState, useRef } from 'react';
import { useDriverSession } from '@/contexts/DriverSessionContext';

export const useShiftTimer = () => {
  const { state, dispatch } = useDriverSession();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkShiftCompletion = useCallback((timestamp?: number) => {
    const now = timestamp || Date.now();

    if (!state.isShiftActive || !state.shiftStartTime || !state.plannedShiftDurationHours) {
      return;
    }

    const shiftDurationMs = (state.plannedShiftDurationHours + state.extendedShiftHours) * 60 * 60 * 1000;
    const elapsedTime = now - state.shiftStartTime;

    // Check if shift duration is complete and extension hasn't been offered
    if (elapsedTime >= shiftDurationMs && !state.shiftExtensionOffered && !state.isShiftCompleted) {
      const totalPlannedHours = state.plannedShiftDurationHours + state.extendedShiftHours;

      // Extension rules:
      // - Shifts < 8h: Can extend multiple times until 13h max
      // - 8h shifts: Single 2h extension allowed  
      // - 10h+ shifts: No extensions permitted
      const canExtend =
        (state.plannedShiftDurationHours < 8 && totalPlannedHours < 13) ||
        (state.plannedShiftDurationHours === 8 && state.extendedShiftHours === 0 && totalPlannedHours < 10);

      if (canExtend) {
        dispatch({ type: 'OFFER_EXTENSION' });
      } else {
        dispatch({ type: 'COMPLETE_SHIFT' });
      }
    }
  }, [state.isShiftActive, state.shiftStartTime, state.plannedShiftDurationHours, state.extendedShiftHours, state.shiftExtensionOffered, state.isShiftCompleted, dispatch]);

  // Update current time every second for real-time calculations
  useEffect(() => {
    if (!state.isShiftActive) {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    // Set up new interval with drift correction
    let expectedTime = Date.now();
    const tick = () => {
      const now = Date.now();
      const drift = now - expectedTime;

      setCurrentTime(now);
      checkShiftCompletion(now);

      // Adjust next tick for drift
      expectedTime += 1000;
      const timeout = Math.max(0, 1000 - drift);
      intervalRef.current = setTimeout(tick, timeout);
    };

    intervalRef.current = setTimeout(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isShiftActive, state.shiftStartTime, checkShiftCompletion]);

  const getCurrentShiftTimeSeconds = useCallback(() => {
    if (!state.isShiftActive || !state.shiftStartTime) return 0;
    return Math.floor((currentTime - state.shiftStartTime) / 1000);
  }, [state.isShiftActive, state.shiftStartTime, currentTime]);

  const getPlannedShiftDurationSeconds = useCallback(() => {
    if (!state.plannedShiftDurationHours) return 0;
    return (state.plannedShiftDurationHours + state.extendedShiftHours) * 3600;
  }, [state.plannedShiftDurationHours, state.extendedShiftHours]);

  const getShiftTimeRemaining = useCallback(() => {
    const elapsed = getCurrentShiftTimeSeconds();
    const planned = getPlannedShiftDurationSeconds();
    return Math.max(0, planned - elapsed);
  }, [getCurrentShiftTimeSeconds, getPlannedShiftDurationSeconds]);

  const isShiftOvertime = useCallback(() => {
    return getCurrentShiftTimeSeconds() > getPlannedShiftDurationSeconds();
  }, [getCurrentShiftTimeSeconds, getPlannedShiftDurationSeconds]);

  const getTotalEarningTimeSeconds = useCallback(() => {
    if (state.isTripActive && state.currentTripStartTime) {
      return state.totalEarningTimeSeconds + Math.floor((currentTime - state.currentTripStartTime) / 1000);
    }
    return state.totalEarningTimeSeconds || 0;
  }, [state.totalEarningTimeSeconds, state.isTripActive, state.currentTripStartTime, currentTime]);

  const getBreakTimeRemainingSeconds = useCallback(() => {
    if (!state.isOnBreak || !state.currentBreakStartTime) return 0;
    const maxBreakDuration = 30 * 60; // 30 minutes in seconds
    const breakElapsed = Math.floor((currentTime - state.currentBreakStartTime) / 1000);
    return Math.max(0, maxBreakDuration - breakElapsed);
  }, [state.isOnBreak, state.currentBreakStartTime, currentTime]);
  
  const getDrivingEfficiency = useCallback(() => {
    const shiftTime = getCurrentShiftTimeSeconds();
    const earningTime = getTotalEarningTimeSeconds();
    if (shiftTime === 0) return 0;
    return Math.round((earningTime / shiftTime) * 100);
  }, [getCurrentShiftTimeSeconds, getTotalEarningTimeSeconds]);

  const getNetHourlyRate = useCallback(() => {
    const earningHours = getTotalEarningTimeSeconds() / 3600;
    const netEarnings = state.totalEarningsThisShift - state.totalExpensesThisShift;
    if (earningHours === 0) return 0;
    return netEarnings / earningHours;
  }, [getTotalEarningTimeSeconds, state.totalEarningsThisShift, state.totalExpensesThisShift]);


  return {
    currentTime,
    getCurrentShiftTimeSeconds,
    getPlannedShiftDurationSeconds,
    getShiftTimeRemaining,
    isShiftOvertime,
    getTotalEarningTimeSeconds,
    getBreakTimeRemainingSeconds,
    getDrivingEfficiency,
    getNetHourlyRate
  };
};
