'use client';
import { useEffect, useCallback, useState } from 'react';
import { useDriverSession } from '@/contexts/DriverSessionContext';

export const useShiftTimer = () => {
  const { state, dispatch } = useDriverSession();
  const [currentTime, setCurrentTime] = useState(Date.now());

  const checkShiftCompletion = useCallback(() => {
    if (!state.isShiftActive || !state.shiftStartTime || !state.plannedShiftDurationHours || state.shiftExtensionOffered) {
      return;
    }

    const now = Date.now();
    const shiftDurationMs = (state.plannedShiftDurationHours + state.extendedShiftHours) * 60 * 60 * 1000;
    const elapsedTime = now - state.shiftStartTime;

    if (elapsedTime >= shiftDurationMs) {
        const totalPlannedHours = state.plannedShiftDurationHours + state.extendedShiftHours;
        const canExtend = totalPlannedHours < 13; // Max 13 hours driving shift in BC
        
        if (canExtend) {
            dispatch({ type: 'OFFER_EXTENSION' });
        }
        // If cannot extend, do nothing. The user will be in overtime and must end shift manually.
    }
  }, [state.isShiftActive, state.shiftStartTime, state.plannedShiftDurationHours, state.extendedShiftHours, state.shiftExtensionOffered, dispatch]);

  useEffect(() => {
    if (state.isShiftActive) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
        checkShiftCompletion();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.isShiftActive, checkShiftCompletion]);

  const getCurrentShiftTimeSeconds = useCallback(() => {
    if (!state.isShiftActive || !state.shiftStartTime) return 0;
    return Math.floor((currentTime - state.shiftStartTime) / 1000);
  }, [state.isShiftActive, state.shiftStartTime, currentTime]);


  const getTotalEarningTimeSeconds = useCallback(() => {
    if (state.isTripActive && state.currentTripStartTime) {
      return state.totalEarningTimeSeconds + Math.floor((currentTime - state.currentTripStartTime) / 1000);
    }
    return state.totalEarningTimeSeconds || 0;
  }, [state.totalEarningTimeSeconds, state.isTripActive, state.currentTripStartTime, currentTime]);
  
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
    getTotalEarningTimeSeconds,
    getDrivingEfficiency,
    getNetHourlyRate
  };
};
