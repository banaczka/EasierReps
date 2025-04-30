import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth } from './firebase';

const firestore = getFirestore();

export async function savePlanForUser(planName: string, selectedDays: string[], exercises: {
  name: string;
  sets: string;
  repsMin: string;
  repsMax: string;
}[]) {
  const user = auth.currentUser;
  if (!user) throw new Error('Brak zalogowanego użytkownika');

  const planRef = await addDoc(collection(firestore, 'users', user.uid, 'plans'), {
    name: planName,
    days: selectedDays,
    createdAt: new Date().toISOString(),
  });

  const exercisesRef = collection(firestore, 'users', user.uid, 'plans', planRef.id, 'exercises');

  for (const ex of exercises) {
    await addDoc(exercisesRef, {
      name: ex.name.trim(),
      sets: parseInt(ex.sets),
      repsRange: `${ex.repsMin.trim()}-${ex.repsMax.trim()}`,
    });
  }

  return planRef.id;
}

export async function getUserPlans() {
  const user = auth.currentUser;
  if (!user) throw new Error('Brak zalogowanego użytkownika');

  const plansRef = collection(firestore, 'users', user.uid, 'plans');
  const snapshot = await getDocs(plansRef);

  const plans = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return plans;
}

export async function deletePlan(planId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Brak zalogowanego użytkownika');

  const planRef = doc(firestore, 'users', user.uid, 'plans', planId);

  const exercisesRef = collection(firestore, 'users', user.uid, 'plans', planId, 'exercises');
  const snapshot = await getDocs(exercisesRef);

  const deletePromises = snapshot.docs.map(ex => deleteDoc(ex.ref));
  await Promise.all(deletePromises);

  await deleteDoc(planRef);
}