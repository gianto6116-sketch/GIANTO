
import { PRAYER_TIMES } from '../constants';

const sendReminder = (message: string) => {
  if (Notification.permission === 'granted') {
    try {
      new Notification(message);
    } catch (e) {
      console.warn('Notification error:', e);
    }
  }
};

export const scheduleReminders = () => {
  if (!('Notification' in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }
  
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }

  Object.entries(PRAYER_TIMES).forEach(([key, value]) => {
    const [hours, minutes] = value.start.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    
    // If target time has already passed today, don't schedule a reminder
    if (target <= now) {
      return;
    }

    const timeout = target.getTime() - now.getTime();
    setTimeout(() => sendReminder(`Waktunya salat ${key}!`), timeout);
  });
};
