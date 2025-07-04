'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

type State = {
  isShiftActive: boolean;
  isTripActive: boolean;
  shiftStartTime: number | null;
  currentTripStartTime: number | null;
  plannedShiftDurationHours: number | null;
  dailyGoal: number | null;
  currentTrips: any[];
  currentExpenses: any[];
  totalEarningTimeSeconds: number;
  shiftExtensionOffered: boolean;
  driverName: string;
};

type Action =
  | { type: 'START_SHIFT'; payload: { startTime: number; dailyGoal: number; durationHours: number; driverName: string } }
  | { type: 'END_SHIFT' }
  | { type: 'START_TRIP' }
  | { type: 'END_TRIP'; payload: any }
  | { type: 'ADD_EXPENSE'; payload: any }
  | { type: 'SET_DAILY_GOAL'; payload: { goal: number } }
  | { type: 'OFFER_SHIFT_EXTENSION' }
  | { type: 'DECLINE_SHIFT_EXTENSION' };

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
  shiftExtensionOffered: false,
  driverName: 'Driver',
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
    case 'END_SHIFT':
      return { ...state, isShiftActive: false, isTripActive: false, shiftStartTime: null };
    case 'START_TRIP':
      return { ...state, isTripActive: true, currentTripStartTime: Date.now() };
    case 'END_TRIP':
      // Simplified logic
      const tripDuration = state.currentTripStartTime ? (Date.now() - state.currentTripStartTime) / 1000 : 0;
      return {
        ...state,
        isTripActive: false,
        currentTripStartTime: null,
        currentTrips: [...state.currentTrips, action.payload],
        totalEarningTimeSeconds: state.totalEarningTimeSeconds + tripDuration,
      };
    case 'ADD_EXPENSE':
      return { ...state, currentExpenses: [...state.currentExpenses, action.payload] };
    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoal: action.payload.goal };
    case 'OFFER_SHIFT_EXTENSION':
      return { ...state, shiftExtensionOffered: true };
    case 'DECLINE_SHIFT_EXTENSION':
        return { ...state, shiftExtensionOffered: false };
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
