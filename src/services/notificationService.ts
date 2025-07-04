
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
  
    schedulePickupReminder(bookingId: string, pickupTime: Date, clientName: string, pickupLocation: string) {
      if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
        return;
      }

      // Read preferences from localStorage
      const prefsString = localStorage.getItem('notificationPreferences');
      const defaultPrefs = { pickupReminders: true, pickupReminderTime: 30, pickupReminderSound: true };
      const prefs = prefsString ? {...defaultPrefs, ...JSON.parse(prefsString)} : defaultPrefs;

      if (!prefs.pickupReminders) {
        console.log('Pickup reminders are disabled by user preference.');
        return;
      }
  
      const now = new Date();
      const timeToPickup = pickupTime.getTime() - now.getTime();
  
      // Schedule reminder based on user preference
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
  
