
class NotificationService {
    private isInitialized = false;
  
    initialize() {
      if (typeof window !== 'undefined' && 'Notification' in window && !this.isInitialized) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          } else {
            console.log('Notification permission denied.');
          }
        });
        this.isInitialized = true;
      }
    }

    private getPreferences() {
      const defaultPrefs = {
          pickupReminders: true,
          pickupReminderTime: 30,
          pickupReminderSound: true,
          performanceMilestones: true,
          milestoneTypes: {
            dailyEarnings: true,
            tripCount: true,
            hoursWorked: true,
          },
      };
      if (typeof window === 'undefined') return defaultPrefs;
      const prefsString = localStorage.getItem('notificationPreferences');
      if (!prefsString) return defaultPrefs;

      try {
        const savedPrefs = JSON.parse(prefsString);
        return {
            ...defaultPrefs,
            ...savedPrefs,
            milestoneTypes: {
                ...defaultPrefs.milestoneTypes,
                ...(savedPrefs.milestoneTypes || {}),
            }
        };
      } catch (e) {
        console.error("Failed to parse notification preferences", e);
        return defaultPrefs;
      }
    }
  
    schedulePickupReminder(bookingId: string, pickupTime: Date, clientName: string, pickupLocation: string) {
      if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
        return;
      }

      const prefs = this.getPreferences();

      if (!prefs.pickupReminders) {
        console.log('Pickup reminders are disabled by user preference.');
        return;
      }
  
      const now = new Date();
      const timeToPickup = pickupTime.getTime() - now.getTime();
  
      const reminderOffset = (prefs.pickupReminderTime || 30) * 60 * 1000;
      const reminderTime = timeToPickup - reminderOffset;
  
      if (reminderTime > 0) {
        setTimeout(() => {
          new Notification('Upcoming Pickup Reminder', {
            body: `Time to head to ${pickupLocation} for ${clientName}'s pickup.`,
            tag: `booking-reminder-${bookingId}`,
            icon: '/logo.png',
            silent: !prefs.pickupReminderSound,
          });
        }, reminderTime);
      }
    }

    showEarningsMilestone(amount: number) {
      const prefs = this.getPreferences();
      if (!prefs.performanceMilestones || !prefs.milestoneTypes.dailyEarnings) return;
  
      new Notification('Earnings Milestone!', {
          body: `You've reached your $${Math.floor(amount)} earnings goal! Keep it up!`,
          tag: `earnings-milestone-${amount}`,
          icon: '/logo.png',
          silent: !prefs.pickupReminderSound,
      });
    }
  
    showTripCountMilestone(count: number) {
      const prefs = this.getPreferences();
      if (!prefs.performanceMilestones || !prefs.milestoneTypes.tripCount) return;
  
      new Notification('Trip Milestone!', {
          body: `Congratulations, you've completed ${count} trips this shift!`,
          tag: `trip-milestone-${count}`,
          icon: '/logo.png',
          silent: !prefs.pickupReminderSound,
      });
    }
  
    showHoursWorkedMilestone(hours: number) {
      const prefs = this.getPreferences();
      if (!prefs.performanceMilestones || !prefs.milestoneTypes.hoursWorked) return;
  
      new Notification('Time Milestone!', {
          body: `You've been on shift for ${hours} hours. Remember to take breaks!`,
          tag: `hours-milestone-${hours}`,
          icon: '/logo.png',
          silent: !prefs.pickupReminderSound,
      });
    }

    launchNavigation(pickupLocation: string, clientName: string) {
        if(navigator.geolocation) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pickupLocation)}`;
            window.open(url, '_blank');
        } else {
            alert("Could not open navigation. Geolocation is not supported by this browser.");
        }
    }
  }
  
  export const notificationService = new NotificationService();
  
