
'use client';

import { useEffect, useRef } from 'react';
import { useDriverSession } from '@/contexts/DriverSessionContext';
import { notificationService } from '@/services/notificationService';

export function MilestoneNotifier() {
  const { state } = useDriverSession();
  const { isShiftActive, dailyGoal, totalEarningsThisShift, currentTrips, shiftStartTime, totalExpensesThisShift } = state;

  const notifiedEarnings = useRef(new Set<number>());
  const notifiedTrips = useRef(new Set<number>());
  const notifiedHours = useRef(new Set<number>());

  // Reset trackers when a new shift starts or when shift status changes
  useEffect(() => {
    if (isShiftActive) {
      notifiedEarnings.current.clear();
      notifiedTrips.current.clear();
      notifiedHours.current.clear();
    }
  }, [isShiftActive, shiftStartTime]);

  // Check for earnings milestones
  useEffect(() => {
    if (!isShiftActive || !dailyGoal || dailyGoal <= 0) return;

    const earningsMilestones = [0.5, 0.75, 1.0]; // 50%, 75%, 100%
    const netEarnings = totalEarningsThisShift - totalExpensesThisShift;

    earningsMilestones.forEach(milestone => {
      const targetAmount = dailyGoal * milestone;
      if (netEarnings >= targetAmount && !notifiedEarnings.current.has(milestone)) {
        notificationService.showEarningsMilestone(targetAmount);
        notifiedEarnings.current.add(milestone);
      }
    });

  }, [isShiftActive, dailyGoal, totalEarningsThisShift, totalExpensesThisShift]);

  // Check for trip count milestones
  useEffect(() => {
    if (!isShiftActive) return;

    const tripCount = currentTrips.length;
    const tripMilestones = [5, 10, 20, 30, 50];

    tripMilestones.forEach(milestone => {
      if (tripCount >= milestone && !notifiedTrips.current.has(milestone)) {
        notificationService.showTripCountMilestone(milestone);
        notifiedTrips.current.add(milestone);
      }
    });
  }, [isShiftActive, currentTrips.length]);
  
  // Check for hours worked milestones
  useEffect(() => {
    if (!isShiftActive || !shiftStartTime) return;

    const hourMilestones = [2, 4, 6, 8, 10, 12];
    
    const interval = setInterval(() => {
        const hoursWorked = (Date.now() - shiftStartTime) / (1000 * 60 * 60);
        
        hourMilestones.forEach(milestone => {
            if (hoursWorked >= milestone && !notifiedHours.current.has(milestone)) {
                notificationService.showHoursWorkedMilestone(milestone);
                notifiedHours.current.add(milestone);
            }
        });
    }, 1000 * 60 * 5); // Check every 5 minutes

    return () => clearInterval(interval);

  }, [isShiftActive, shiftStartTime]);

  return null;
}
