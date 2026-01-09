import { LocalNotifications } from '@capacitor/local-notifications';
import { useCallback, useEffect, useState } from 'react';

export const useNotifications = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = useCallback(async () => {
    try {
      const result = await LocalNotifications.requestPermissions();
      if (result.display === 'granted') {
        setHasPermission(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error requesting notification permissions:', e);
      return false;
    }
  }, []);

  useEffect(() => {
    // Create channel for Android
    LocalNotifications.createChannel({
      id: 'turn_notifications',
      name: 'Turn Notifications',
      description: 'Alerts when it is your turn',
      importance: 5,
      visibility: 1,
      vibration: true,
    }).catch(e => console.error("Channel creation error", e));

    LocalNotifications.checkPermissions().then((result) => {
      setHasPermission(result.display === 'granted');
    });
  }, []);

  const sendTurnNotification = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "¡Es tu turno!",
            body: "Todos los jugadores están esperando tu jugada en Catan Online.",
            id: 1,
            // Fire immediately
            schedule: { at: new Date(Date.now() + 100) },
            channelId: 'turn_notifications',
            sound: 'beep.wav',
            smallIcon: 'res_icon', // Android specific resource if available
            actionTypeId: "",
            extra: null
          }
        ]
      });
    } catch (e) {
      console.error('Error scheduling notification:', e);
    }
  }, [hasPermission, requestPermission]);

  return {
    hasPermission,
    requestPermission,
    sendTurnNotification
  };
};
