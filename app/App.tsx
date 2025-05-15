import { getUserNotification } from '@/lib/firebase';
import { scheduleNotification } from '@/lib/notification';
import 'fast-text-encoding';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const initializeNotification = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const notification = await getUserNotification(user.uid);
          if (notification) {
            scheduleNotification(notification.title, notification.body, notification.hour, notification.minute);
            console.log('Powiadomienie ustawione przy starcie aplikacji.');
          }
        }
      } catch (error) {
        console.error('Błąd podczas ustawiania powiadomienia przy starcie:', error);
      }
    };
  
    initializeNotification();
  }, []);
  

  return null;
}
