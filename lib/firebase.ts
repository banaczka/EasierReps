import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, Timestamp, where, } from "firebase/firestore";

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
export const db = getFirestore(app);
export async function savePlanToFirestore(name: string, days: string[], exercises: any[]) {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error("Użytkownik niezalogowany")
    }
    const plan = {
      userId: user.uid,
      name,
      days,
      createdAt: Timestamp.now(),
      exercises
    };
    const docRef = await addDoc(collection(db, "plans"), plan);
    console.log("Plan zapisany z id: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Błąd podczas zapisu planu: ", error);
    throw error;
  }
}

export async function getUserPlans() {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Brak zalogowanego użytkownika");

  const plansSnapshot = await getDocs(collection(db, "plans"));
  const plans = plansSnapshot.docs
    .map(doc => {
      const data = doc.data() as {userId: string, name: string, days: string[], exercises: any[], createdAt: any};
      return { id: doc.id, ...data};
    })
    .filter(plan => plan.userId === user.uid);

  return plans;
}

export async function deletePlan(planId: string) {
  try {
    await deleteDoc(doc(db, "plans", planId));
    console.log("Plan usunięty:", planId);
  } catch (error) {
    console.error("Błąd usuwania planu:", error);
    throw error;
  }
}

export async function saveWorkoutSession(planId: string, exercises: any[]) {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("Użytkownik niezalogowany!");

    const planRef = doc(db, "plans", planId);
    const planSnap = await getDoc(planRef);

    const planName = planSnap.exists() ? planSnap.data().name : "Nieznany plan";

    const workoutSession = {
      userId: user.uid,
      planId,
      name: planName,
      date: Timestamp.now(),
      exercises,
    };

    const docRef = await addDoc(collection(db, "workoutSessions"), workoutSession);
    console.log("Sesja treningowa zapisana z ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Błąd zapisu sesji treningowej: ", error);
    throw error;
  }
}

export async function getUserWorkoutSessions() {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Brak zalogowanego użytkownika");

  const sessionsSnapshot = await getDocs(collection(db, "workoutSessions"));
  const sessions = sessionsSnapshot.docs
    .map(doc => {
      const data = doc.data() as { userId: string, planId: string, date: any, exercises: any[] };
      return { id: doc.id, ...data };
    })
    .filter(session => session.userId === user.uid);

  return sessions;
}

export async function deleteWorkoutSession(sessionId: string) {
  try {
    await deleteDoc(doc(db, "workoutSessions", sessionId));
    console.log("Sesja treningowa usunięta:", sessionId);
  } catch (error) {
    console.error("Błąd usuwania sesji treningowej:", error);
    throw error;
  }
}

export async function getWorkoutHistory() {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("Brak zalogowanego użytkownika");

    const q = query(
      collection(db, "workoutSessions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log("Historia treningów pobrana:", history);
    return history;
  } catch (error) {
    console.error("Błąd pobierania historii treningów:", error);
    throw error;
  }
}

export async function saveMealToFirestore(name: string, calories: number) {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("Użytkownik niezalogowany!");

    const meal = {
      userId: user.uid,
      name,
      calories,
      date: Timestamp.now(),
    };

    await addDoc(collection(db, "meals"), meal);
    console.log("Posiłek zapisany:", name);
  } catch (error) {
    console.error("Błąd zapisu posiłku:", error);
    throw error;
  }
}

export async function getTodayMeals() {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("Brak zalogowanego użytkownika");

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "meals"),
      where("userId", "==", user.uid),
      where("date", ">=", Timestamp.fromDate(startOfDay))
    );

    const querySnapshot = await getDocs(q);
    const meals = querySnapshot.docs.map((doc) => {
      const data = doc.data() as { name: string; calories: number; date: any };
      return { id: doc.id, ...data };
    });
    return meals;
  } catch (error) {
    console.error("Błąd pobierania posiłków:", error);
    throw error;
  }
}