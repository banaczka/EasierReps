import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUserPlans, saveWorkoutSession } from '../lib/firebase';

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams();
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const plans = await getUserPlans();
        const selectedPlan = plans.find(plan => plan.id === planId);
        if (selectedPlan) {
          setExercises(selectedPlan.exercises);
        }
      } catch (error) {
        console.error('Błąd ładowania planu:', error);
      }
    };
    loadPlan();
  }, [planId]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Ostrzeżenie',
          'Opuszczenie tego ekranu spowoduje utratę treningu. Czy na pewno chcesz zakończyć?',
          [
            { text: 'Nie', style: 'cancel' },
            { text: 'Tak', onPress: () => router.replace('/(tabs)/dashboard') },
          ]
        );
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
    }, [])
  );

  const startRest = () => {
    const restSeconds = parseInt(restTime);
    if (isNaN(restSeconds) || restSeconds <= 0) {
      Alert.alert('Błąd', 'Czas odpoczynku musi być większy od zera');
      return;
    }
    setCountdown(restSeconds);
    setIsResting(true);
  };

  const addMinute = () => {
    setCountdown((prev) => (prev !== null ? prev + 60 : 60));
  };

  const endRest = () => {
    setIsResting(false);
    setCountdown(null);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsResting(false);
      setCountdown(null);
      nextSetOrExercise();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const nextSetOrExercise = () => {
    if (currentSet >= exercises[currentExercise].sets) {
      if (currentExercise >= exercises.length - 1) {
        saveSession(sessionData);
        return;
      }
      setCurrentExercise(currentExercise + 1);
      setCurrentSet(1);
    } else {
      setCurrentSet(currentSet + 1);
    }
  };

  const handleFinishSet = () => {
    if (!reps || parseInt(reps) <= 0) {
      Alert.alert('Błąd', 'Wprowadź liczbę powtórzeń większą od zera');
      return;
    }
    if (isNaN(parseFloat(weight)) || parseFloat(weight) < 0) {
      Alert.alert('Błąd', 'Wprowadź ciężar większy lub równy 0');
      return;
    }

    const updatedSession = [...sessionData];
    if (!updatedSession[currentExercise]) {
      updatedSession[currentExercise] = { name: exercises[currentExercise].name, sets: [] };
    }
    updatedSession[currentExercise].sets.push({ reps: parseInt(reps), weight: parseFloat(weight) });

    setSessionData(updatedSession);
    setReps('');
    setWeight('');

    const isLastSet = currentSet >= exercises[currentExercise].sets;
    const isLastExercise = currentExercise >= exercises.length - 1;

    if (isLastSet && isLastExercise) {
      saveSession(updatedSession);
    } else if (isLastSet) {
      setCurrentExercise(currentExercise + 1);
      startRest();
      setCurrentSet(1);
    } else {
      setCurrentSet(currentSet + 1);
      startRest();
    }
  };

  const saveSession = async (data: any[]) => {
    try {
      await saveWorkoutSession(planId as string, data);
      Alert.alert('Sukces', 'Sesja treningowa zapisana!');
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zapisać sesji treningowej.');
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Ostrzeżenie',
      'Opuszczenie tego ekranu spowoduje utratę treningu. Czy na pewno chcesz zakończyć?',
      [
        { text: 'Nie', style: 'cancel' },
        { text: 'Tak', onPress: () => router.replace('/(tabs)/dashboard') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {exercises.length > 0 && currentExercise < exercises.length && (
        <>
          {!isResting ? (
            <>
              <Text style={styles.exerciseName}>{exercises[currentExercise].name} ({currentSet} / {exercises[currentExercise].sets})
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Powtórzenia"
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Ciężar (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Czas odpoczynku (s)"
                value={restTime}
                onChangeText={setRestTime}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.button} onPress={handleFinishSet}>
                <Text style={styles.buttonText}>{currentSet >= exercises[currentExercise]?.sets && currentExercise >= exercises.length - 1 ? 'Zakończ trening' : 'Zakończ serie'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.exerciseName}>Następna seria: {exercises[currentExercise].name} ({currentSet} / {exercises[currentExercise].sets})
              </Text>
              <Text style={styles.timerText}>Odpoczynek: {countdown} s</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} onPress={addMinute}>
                  <Text style={styles.buttonText}>+1 Minuta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={endRest}>
                  <Text style={styles.buttonText}>Zakończ odpoczynek</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleExit}>
      <Text style={styles.buttonText}>Zakończ trening</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#121212', 
    padding: 24, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  exerciseName: { 
    fontSize: 22, 
    color: '#fff', 
    marginBottom: 12 
  },
  input: { 
    backgroundColor: '#333', 
    color: '#fff', 
    padding: 12, 
    marginVertical: 8, 
    borderRadius: 8, 
    width: '80%' 
  },
  button: { 
    backgroundColor: '#10b981', 
    padding: 14, 
    margin: 8, 
    borderRadius: 8, 
    width: '60%', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18 
  },
  timerText: { 
    color: '#fff', 
    fontSize: 22, 
    marginVertical: 12 
  },
  buttonGroup: { 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },
});
