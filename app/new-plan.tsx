import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { savePlanToFirestore } from '../lib/firebase';

interface Exercise {
  name: string;
  sets: number;
  repsRange: string;
}

const router = useRouter();

const daysOfWeek = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"];

export default function NewPlanScreen() {
  const [planName, setPlanName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [repsMin, setRepsMin] = useState('');
  const [repsMax, setRepsMax] = useState('');

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const isExerciseValid = () => {
    const setsNum = parseInt(sets);
    const repsMinNum = parseInt(repsMin);
    const repsMaxNum = parseInt(repsMax);

    if (!exerciseName || isNaN(setsNum) || isNaN(repsMinNum) || isNaN(repsMaxNum)) {
      Alert.alert('Błąd', 'Uzupełnij wszystkie pola dotyczące ćwiczenia');
      return false;
    }
    if (setsNum <= 0 || repsMinNum <= 0 || repsMaxNum <= 0) {
      Alert.alert('Błąd', 'Wartości muszą być większe od zera');
      return false;
    }
    if (repsMinNum > repsMaxNum) {
      Alert.alert('Błąd', 'Minimalna liczba powtórzeń nie może być większa od maksymalnej');
      return false;
    }
    return true;
  };

  const addExercise = () => {
    if (!isExerciseValid()) return;

    const newExercise: Exercise = {
      name: exerciseName,
      sets: parseInt(sets),
      repsRange: `${repsMin}-${repsMax}`,
    };

    setExercises([...exercises, newExercise]);
    setExerciseName('');
    setSets('');
    setRepsMin('');
    setRepsMax('');
  };

  const handleSavePlan = async () => {
    if (!planName || selectedDays.length === 0 || exercises.length === 0) {
      Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
      return;
    }

    try {
      await savePlanToFirestore(planName, selectedDays, exercises);
      Alert.alert('Sukces', 'Plan został zapisany!');
      setPlanName('');
      setSelectedDays([]);
      setExercises([]);
      router.replace('/(tabs)/workouts');
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Błąd zapisu', error.message);
      } else {
        Alert.alert('Błąd', 'Wystąpił nieznany błąd');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj nowy plan treningowy</Text>

      <TextInput
        placeholder="Nazwa planu"
        value={planName}
        onChangeText={setPlanName}
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.subtitle}>Wybierz dni tygodnia:</Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDays.includes(day) && styles.selectedDayButton]}
            onPress={() => toggleDay(day)}
          >
            <Text style={styles.dayButtonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Dodaj ćwiczenie:</Text>
      <TextInput
        placeholder="Nazwa ćwiczenia"
        value={exerciseName}
        onChangeText={setExerciseName}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Ilość serii"
        value={sets}
        onChangeText={setSets}
        style={styles.input}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Min powtórzeń"
        value={repsMin}
        onChangeText={setRepsMin}
        style={styles.input}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Max powtórzeń"
        value={repsMax}
        onChangeText={setRepsMax}
        style={styles.input}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={addExercise}>
        <Text style={styles.buttonText}>Dodaj ćwiczenie</Text>
      </TouchableOpacity>

      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exercise}>{item.name} - {item.sets}x ({item.repsRange})</Text>
            <TouchableOpacity onPress={() => removeExercise(index)}>
              <Text style={styles.deleteText}>Usuń</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePlan}>
        <Text style={styles.buttonText}>Zapisz plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  dayButton: {
    backgroundColor: '#444',
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: '#6200ee',
  },
  dayButtonText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  exercise: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 3,
  },
  deleteText: {
    color: '#ff4d4d',
    marginLeft: 10 
  },
  exerciseContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 10, 
    marginVertical: 5, 
    backgroundColor: '#1e1e1e', 
    borderRadius: 8 
  },
});
