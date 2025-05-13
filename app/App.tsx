import { auth } from '@/lib/firebase';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("Zalogowany użytkownik:", currentUser.uid);
        router.replace('/(tabs)/dashboard');
      } else {
        console.log("Nie zalogowano");
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
