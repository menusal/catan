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
            schedule: { at: new Date(Date.now() + 100) },
            sound: undefined,
            attachments: undefined,
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
