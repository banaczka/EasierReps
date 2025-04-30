import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'session_uid';

export async function registerUser(email: string, password: string, username: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(userCredential.user, {
    displayName: username,
  });

  await AsyncStorage.setItem(SESSION_KEY, userCredential.user.uid);
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await AsyncStorage.setItem(SESSION_KEY, userCredential.user.uid);
}

export async function logoutUser() {
  await signOut(auth);
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getSessionUid() {
  return await AsyncStorage.getItem(SESSION_KEY);
}


export async function isUserLoggedIn(): Promise<boolean> {
    const uid = await AsyncStorage.getItem(SESSION_KEY);
    return !!uid;
  }