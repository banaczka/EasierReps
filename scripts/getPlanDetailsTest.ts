import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../lib/firebase';
import { getExercisesForPlan } from '../lib/planService';

(async () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  try {
    const userCred = await signInWithEmailAndPassword(auth, 'uwu@test.com', 'password');
    console.log('Zalogowano jako:', userCred.user.email);

    const exercises = await getExercisesForPlan('yoTiTc8jcAm0SZprDMLd');
    console.log('Ćwiczenia:', exercises);
  } catch (error) {
    console.error('Błąd logowania lub pobierania danych:', error);
  }
})();
