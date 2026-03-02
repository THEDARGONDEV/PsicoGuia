import React, { useEffect, useState } from 'react';
import { INITIAL_TASKS } from '../data/tasks';

// Minimalist sound (base64 encoded short beep)
const NOTIFICATION_SOUND = 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

export default function NotificationManager() {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkAlarms = () => {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;

      // 1. Check Daily Morning Notification (e.g., 08:00 AM)
      if (currentTime === '08:00') {
        const todayDate = now.toISOString().split('T')[0];
        const lastDaily = localStorage.getItem('last_daily_notification');
        
        if (lastDaily !== todayDate) {
          sendSystemNotification(
            '¡Buenos días! ☀️',
            'No olvides realizar las actividades de hoy con Jorge y Valentina.'
          );
          localStorage.setItem('last_daily_notification', todayDate);
        }
      }

      // 2. Check Valentina's Task Alarms
      const valentinaTasks = INITIAL_TASKS.filter(t => t.childId === 'valentina');
      
      valentinaTasks.forEach(task => {
        const alarmTime = localStorage.getItem(`alarm_${task.id}`);
        const lastTriggered = localStorage.getItem(`alarm_triggered_${task.id}`);
        const todayDate = now.toISOString().split('T')[0];

        if (alarmTime === currentTime && lastTriggered !== todayDate) {
          // Trigger alarm
          localStorage.setItem(`alarm_triggered_${task.id}`, todayDate);
          
          if (document.visibilityState === 'visible') {
            // In-app visual feedback (subtle red flash)
            triggerRedFlash();
          } else {
            // Background notification
            sendSystemNotification(
              'Hora de Actividad - Valentina',
              `Es hora de realizar: ${task.title}`
            );
          }
        }
      });
    };

    // Check every 30 seconds
    const interval = setInterval(checkAlarms, 30000);
    // Initial check
    checkAlarms();

    return () => clearInterval(interval);
  }, []);

  const triggerRedFlash = () => {
    setIsFlashing(true);
    // Play sound even if in app (optional, but requested minimalist sound for background)
    // We'll just do the visual flash for in-app as requested: "ponga en rojo temporalmente la aplicación sutilmente"
    setTimeout(() => {
      setIsFlashing(false);
    }, 3000); // 3 seconds flash
  };

  const sendSystemNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      // Play minimalist sound
      try {
        const audio = new Audio(NOTIFICATION_SOUND);
        audio.play().catch(e => console.log('Audio play blocked:', e));
      } catch (e) {
        console.log('Audio error:', e);
      }

      // Show notification
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body,
            icon: '/vite.svg', // Placeholder icon
            tag: 'psicoguia-notification'
          });
        });
      } else {
        new Notification(title, { body });
      }
    }
  };

  if (!isFlashing) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] bg-red-500/20 animate-pulse transition-colors duration-1000" />
  );
}
