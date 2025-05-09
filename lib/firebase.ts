import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkb0g8fLi9uyZjTu9ArbkVHK8b6GCp7Ko",
  authDomain: "easierrepsnew.firebaseapp.com",
  projectId: "easierrepsnew",
  storageBucket: "easierrepsnew.firebasestorage.app",
  messagingSenderId: "962887154104",
  appId: "1:962887154104:web:8b2c33d753f46207edb74d"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});