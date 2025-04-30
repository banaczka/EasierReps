import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCMKiiZ9pmrrrkHyS3YA1qNQ9qU9rmHano",
    authDomain: "easier-reps-545f4.firebaseapp.com",
    projectId: "easier-reps-545f4",
    storageBucket: "easier-reps-545f4.firebasestorage.app",
    messagingSenderId: "922427568180",
    appId: "1:922427568180:web:c71ac53a7a660ec1e4da61",
    measurementId: "G-KRKW1SLGTG"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export {firebaseConfig}