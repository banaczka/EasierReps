import { collection, getDocs, query, where,  addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getUserPlans(uid: string) {
  const plansRef = collection(db, 'plans');
  const q = query(plansRef, where('userId', '==', uid));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addPlanWithExercises(uid: string, planName: string, days: string[], exercises: any[]) {
    const planRef = await addDoc(collection(db, 'plans'), {
      userId: uid,
      name: planName,
      days: days,
      createdAt: new Date().toISOString(),
    });

    const exercisesRef = collection(planRef, 'exercises');

    await Promise.all(
      exercises.map((ex) => {
        return addDoc(exercisesRef, {
          name: ex.name,
          sets: parseInt(ex.sets),
          repsRange: `${ex.repsMin}-${ex.repsMax}`,
        });
      })
    );
  }