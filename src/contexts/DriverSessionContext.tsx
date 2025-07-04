
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';
import { formatTime } from '@/lib/formatTime';

export type Trip = {
  id: string;
  fare: number;
  tip: number;
  startTime: number;
  endTime?: number;
  durationSeconds: number;
  designationType: 'prime' | 'platform';
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
};

export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  timestamp: number;
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
  isOnBreak: boolean;
  currentBreakStartTime: number | null;
};

type Action =
  | { type: 'START_SHIFT'; payload: { startTime: number; dailyGoal: number; durationHours: number; driverName: string } }
  | { type: 'END_SHIFT' }
  | { type: 'START_TRIP' }
  | { type: 'END_TRIP'; payload: { fare: number; tip: number; durationSeconds: number; pickupLocation?: string; dropoffLocation?: string; } }
  | { type: 'ADD_COMPLETED_TRIP'; payload: Trip }
  | { type: 'REMOVE_TRIP'; payload: string } // tripId
  | { type: 'UPDATE_TRIP'; payload: Trip }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'REMOVE_EXPENSE'; payload: string } // expenseId
  | { type: 'SET_DAILY_GOAL'; payload: { goal: number } }
  | { type: 'OFFER_EXTENSION' }
  | { type: 'DECLINE_EXTENSION' }
  | { type: 'ACCEPT_EXTENSION'; payload: { hours: number } }
  | { type: 'START_BREAK' }
  | { type: 'END_BREAK' };

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
  isOnBreak: false,
  currentBreakStartTime: null,
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
        // Carry over the daily goal if it was changed before starting
        dailyGoal: state.dailyGoal,
      };
    case 'END_SHIFT': {
        // This action now simply resets the shift state.
        // The summary is displayed in the confirmation dialog before this is called.
        return {
          ...state,
          isShiftActive: false,
          isTripActive: false,
          shiftStartTime: null,
          currentTripStartTime: null,
          plannedShiftDurationHours: null,
          currentTrips: [],
          currentExpenses: [],
          totalEarningTimeSeconds: 0,
          totalEarningsThisShift: 0,
          totalExpensesThisShift: 0,
          shiftExtensionOffered: false,
          extendedShiftHours: 0,
          isOnBreak: false,
          currentBreakStartTime: null,
        };
      }
    case 'START_TRIP':
      if (state.isOnBreak) return state; // Cannot start trip during break
      return { ...state, isTripActive: true, currentTripStartTime: Date.now() };
    case 'END_TRIP': {
        if (!state.currentTripStartTime) return state; // Should not happen
        const newTrip: Trip = {
            id: crypto.randomUUID(),
            startTime: state.currentTripStartTime,
            endTime: Date.now(),
            designationType: 'platform',
            pickupLocation: action.payload.pickupLocation || 'Live Trip',
            dropoffLocation: action.payload.dropoffLocation || 'N/A',
            notes: '',
            ...action.payload,
        };
        return {
            ...state,
            isTripActive: false,
            currentTripStartTime: null,
            currentTrips: [...state.currentTrips, newTrip],
            totalEarningTimeSeconds: state.totalEarningTimeSeconds + action.payload.durationSeconds,
            totalEarningsThisShift: state.totalEarningsThisShift + action.payload.fare + action.payload.tip,
        };
    }
    case 'ADD_COMPLETED_TRIP':
        return {
            ...state,
            currentTrips: [...state.currentTrips, action.payload],
            totalEarningsThisShift: state.totalEarningsThisShift + action.payload.fare + action.payload.tip,
        };
    case 'REMOVE_TRIP': {
        const tripToRemove = state.currentTrips.find(t => t.id === action.payload);
        if (!tripToRemove) return state;

        const newTotalEarnings = state.totalEarningsThisShift - (tripToRemove.fare + tripToRemove.tip);
        const newTotalEarningTime = state.totalEarningTimeSeconds - tripToRemove.durationSeconds;

        return {
            ...state,
            currentTrips: state.currentTrips.filter(t => t.id !== action.payload),
            totalEarningsThisShift: newTotalEarnings,
            totalEarningTimeSeconds: newTotalEarningTime,
        };
    }
    case 'UPDATE_TRIP':
        return {
            ...state,
            currentTrips: state.currentTrips.map(t =>
                t.id === action.payload.id ? action.payload : t
            ),
        };
    case 'ADD_EXPENSE':
      return { 
        ...state, 
        currentExpenses: [...state.currentExpenses, action.payload],
        totalExpensesThisShift: state.totalExpensesThisShift + action.payload.amount,
      };
    case 'REMOVE_EXPENSE': {
      const expenseToRemove = state.currentExpenses.find(e => e.id === action.payload);
      if (!expenseToRemove) return state;

      return {
        ...state,
        currentExpenses: state.currentExpenses.filter(e => e.id !== action.payload),
        totalExpensesThisShift: state.totalExpensesThisShift - expenseToRemove.amount,
      };
    }
    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoal: action.payload.goal };
    case 'OFFER_EXTENSION':
      return { ...state, shiftExtensionOffered: true };
    case 'DECLINE_EXTENSION':
        return { ...state, shiftExtensionOffered: false };
    case 'ACCEPT_EXTENSION':
        return { ...state, extendedShiftHours: state.extendedShiftHours + action.payload.hours, shiftExtensionOffered: false };
    case 'START_BREAK':
        if(state.isTripActive) return state; // Cannot start break during trip
        return { ...state, isOnBreak: true, currentBreakStartTime: Date.now() };
    case 'END_BREAK':
        return { ...state, isOnBreak: false, currentBreakStartTime: null };
    default:
      return state;
  }
}

type DriverSessionContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  startLiveTrip: () => void;
  endShift: () => void;
  getGoalEta: () => string;
  removeExpense: (expenseId: string) => void;
};

const DriverSessionContext = createContext<DriverSessionContextType | undefined>(undefined);

export function DriverSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const startLiveTrip = () => {
    dispatch({ type: 'START_TRIP' });
  };
  
  const endShift = () => {
    dispatch({ type: 'END_SHIFT' });
  };

  const removeExpense = (expenseId: string) => {
    dispatch({ type: 'REMOVE_EXPENSE', payload: expenseId });
  };

  const getGoalEta = () => {
    if (!state.isShiftActive || !state.shiftStartTime || state.dailyGoal <= 0) {
      return '--';
    }

    const netEarnings = state.totalEarningsThisShift - state.totalExpensesThisShift;
    if (netEarnings >= state.dailyGoal) {
      return 'Achieved';
    }

    const tripCount = state.currentTrips.length;
    if (tripCount === 0) {
        return 'Calculating...';
    }

    const remainingToGoal = state.dailyGoal - netEarnings;
    const totalEarnings = state.totalEarningsThisShift;
    const averageTripValue = totalEarnings / tripCount;
    const tripsToGoal = Math.ceil(remainingToGoal / averageTripValue);

    const shiftDurationHours = (Date.now() - state.shiftStartTime) / (1000 * 60 * 60);
    const averageTimePerTripMinutes = shiftDurationHours > 0 ? (shiftDurationHours * 60) / tripCount : 45; // Default 45 mins
    
    const etaMinutes = tripsToGoal * averageTimePerTripMinutes;

    if (etaMinutes > 60 * 24) { // Cap at 24 hours for sanity
        return '>24h';
    }

    const etaHours = Math.floor(etaMinutes / 60);
    const etaRemainingMinutes = Math.round(etaMinutes % 60);

    return `${etaHours}h ${etaRemainingMinutes}m`;
  };

  return (
    <DriverSessionContext.Provider value={{ state, dispatch, startLiveTrip, endShift, getGoalEta, removeExpense }}>
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
