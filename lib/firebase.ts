import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyCkb0g8fLi9uyZjTu9ArbkVHK8b6GCp7Ko",

  authDomain: "easierrepsnew.firebaseapp.com",

  projectId: "easierrepsnew",

  storageBucket: "easierrepsnew.firebasestorage.app",

  messagingSenderId: "962887154104",

  appId: "1:962887154104:web:8b2c33d753f46207edb74d"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;