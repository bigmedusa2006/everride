'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';
import { formatTime } from '@/lib/formatTime';

export type Trip = {
  fare: number;
  tip: number;
  durationSeconds: number;
};

export type Expense = {
  amount: number;
  category: string;
};

export type ShiftSummaryData = {
  totalEarnings: number;
  totalExpenses: number;
  netEarnings: number;
  totalTrips: number;
  totalTips: number;
  avgTripValue: number;
  totalTime: string;
  activeTime: string;
  breakTime: string;
  hourlyRate: number;
  shiftStartTime: number;
  shiftEndTime: number;
  dailyGoal: number;
};


type State = {
  isShiftActive: boolean;
  isTripActive: boolean;
  shiftStartTime: number | null;
  currentTripStartTime: number | null;
  plannedShiftDurationHours: number | null;
  dailyGoal: number;
  currentTrips: Trip[];
  currentExpenses: Expense[];
  totalEarningTimeSeconds: number;
  totalEarningsThisShift: number;
  totalExpensesThisShift: number;
  shiftExtensionOffered: boolean;
  driverName: string;
  extendedShiftHours: number;
  isShiftCompleted: boolean;
  isOnBreak: boolean;
  currentBreakStartTime: number | null;
  lastShiftSummary: ShiftSummaryData | null;
};

type Action =
  | { type: 'START_SHIFT'; payload: { startTime: number; dailyGoal: number; durationHours: number; driverName: string } }
  | { type: 'END_SHIFT' }
  | { type: 'START_TRIP' }
  | { type: 'END_TRIP'; payload: Trip }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'SET_DAILY_GOAL'; payload: { goal: number } }
  | { type: 'OFFER_EXTENSION' }
  | { type: 'DECLINE_EXTENSION' }
  | { type: 'ACCEPT_EXTENSION'; payload: { hours: number } }
  | { type: 'COMPLETE_SHIFT' }
  | { type: 'START_BREAK' }
  | { type: 'END_BREAK' }
  | { type: 'CLEAR_SUMMARY' };

const initialState: State = {
  isShiftActive: false,
  isTripActive: false,
  shiftStartTime: null,
  currentTripStartTime: null,
  plannedShiftDurationHours: null,
  dailyGoal: 200,
  currentTrips: [],
  currentExpenses: [],
  totalEarningTimeSeconds: 0,
  totalEarningsThisShift: 0,
  totalExpensesThisShift: 0,
  shiftExtensionOffered: false,
  driverName: 'Driver',
  extendedShiftHours: 0,
  isShiftCompleted: false,
  isOnBreak: false,
  currentBreakStartTime: null,
  lastShiftSummary: null,
};

function sessionReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_SHIFT':
      return {
        ...initialState,
        isShiftActive: true,
        shiftStartTime: action.payload.startTime,
        dailyGoal: action.payload.dailyGoal,
        plannedShiftDurationHours: action.payload.durationHours,
        driverName: action.payload.driverName,
      };
    case 'END_SHIFT': {
        if (!state.isShiftActive || !state.shiftStartTime) return state;

        const shiftEndTime = Date.now();
        const totalShiftSeconds = (shiftEndTime - state.shiftStartTime) / 1000;
        const earningTimeSeconds = state.totalEarningTimeSeconds;
        const breakTimeSeconds = totalShiftSeconds - earningTimeSeconds;
        
        const netEarnings = state.totalEarningsThisShift - state.totalExpensesThisShift;
        const earningHours = earningTimeSeconds > 0 ? earningTimeSeconds / 3600 : 0;
        const hourlyRate = earningHours > 0 ? netEarnings / earningHours : 0;
        
        const totalTrips = state.currentTrips.length;
        const totalTips = state.currentTrips.reduce((sum, trip) => sum + trip.tip, 0);
        const avgTripValue = totalTrips > 0 ? state.totalEarningsThisShift / totalTrips : 0;

        const summary: ShiftSummaryData = {
          totalEarnings: state.totalEarningsThisShift,
          totalExpenses: state.totalExpensesThisShift,
          netEarnings: netEarnings,
          totalTrips: totalTrips,
          totalTips: totalTips,
          avgTripValue: avgTripValue,
          totalTime: formatTime(totalShiftSeconds),
          activeTime: formatTime(earningTimeSeconds),
          breakTime: formatTime(breakTimeSeconds),
          hourlyRate: hourlyRate,
          shiftStartTime: state.shiftStartTime,
          shiftEndTime: shiftEndTime,
          dailyGoal: state.dailyGoal,
        };

        return {
          ...state,
          isShiftActive: false,
          isTripActive: false,
          shiftExtensionOffered: false,
          isShiftCompleted: true,
          lastShiftSummary: summary,
        };
      }
    case 'START_TRIP':
      if (state.isOnBreak) return state; // Cannot start trip during break
      return { ...state, isTripActive: true, currentTripStartTime: Date.now() };
    case 'END_TRIP':
      const tripDuration = state.currentTripStartTime ? (Date.now() - state.currentTripStartTime) / 1000 : 0;
      return {
        ...state,
        isTripActive: false,
        currentTripStartTime: null,
        currentTrips: [...state.currentTrips, action.payload],
        totalEarningTimeSeconds: state.totalEarningTimeSeconds + tripDuration,
        totalEarningsThisShift: state.totalEarningsThisShift + action.payload.fare + action.payload.tip,
      };
    case 'ADD_EXPENSE':
      return { 
        ...state, 
        currentExpenses: [...state.currentExpenses, action.payload],
        totalExpensesThisShift: state.totalExpensesThisShift + action.payload.amount,
      };
    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoal: action.payload.goal };
    case 'OFFER_EXTENSION':
      return { ...state, shiftExtensionOffered: true };
    case 'DECLINE_EXTENSION':
        return { ...state, shiftExtensionOffered: false };
    case 'ACCEPT_EXTENSION':
        return { ...state, extendedShiftHours: state.extendedShiftHours + action.payload.hours, shiftExtensionOffered: false };
    case 'COMPLETE_SHIFT':
        return { ...state, isShiftActive: false, isTripActive: false, isShiftCompleted: true };
    case 'START_BREAK':
        if(state.isTripActive) return state; // Cannot start break during trip
        return { ...state, isOnBreak: true, currentBreakStartTime: Date.now() };
    case 'END_BREAK':
        return { ...state, isOnBreak: false, currentBreakStartTime: null };
    case 'CLEAR_SUMMARY':
      return {
        ...state,
        lastShiftSummary: null,
        shiftStartTime: null,
        currentTripStartTime: null,
        plannedShiftDurationHours: null,
        dailyGoal: 200,
        currentTrips: [],
        currentExpenses: [],
        totalEarningTimeSeconds: 0,
        totalEarningsThisShift: 0,
        totalExpensesThisShift: 0,
        extendedShiftHours: 0,
        isShiftCompleted: false,
        isOnBreak: false,
        currentBreakStartTime: null,
      };
    default:
      return state;
  }
}

type DriverSessionContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  startLiveTrip: () => void;
  endShift: () => void;
};

const DriverSessionContext = createContext<DriverSessionContextType | undefined>(undefined);

export function DriverSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const startLiveTrip = () => {
    dispatch({ type: 'START_TRIP' });
  };
  
  const endShift = () => {
    dispatch({ type: 'END_SHIFT' });
  }

  return (
    <DriverSessionContext.Provider value={{ state, dispatch, startLiveTrip, endShift }}>
      {children}
    </DriverSessionContext.Provider>
  );
}

export function useDriverSession() {
  const context = useContext(DriverSessionContext);
  if (context === undefined) {
    throw new Error('useDriverSession must be used within a DriverSessionProvider');
  }
  return context;
}
