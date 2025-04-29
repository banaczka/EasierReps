import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../lib/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

const daysOfWeek = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

export default function CreatePlan() {
  const router = useRouter();

  const [planName, setPlanName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [exercises, setExercises] = useState<
    { name: string; sets: string; repsMin: string; repsMax: string }[]
  >([]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', repsMin: '', repsMax: '' }]);
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updated = [...exercises];
    updated[index][field as keyof typeof updated[0]] = value;
    setExercises(updated);
  };

  const savePlan = async () => {

    for (const ex of exercises) {
        if (
          !ex.name.trim() ||
          !ex.sets.trim() ||
          !ex.repsMin.trim() ||
          !ex.repsMax.trim()
        ) {
          Alert.alert('Wszystkie ćwiczenia muszą być uzupełnione.');
          return;
        }
      }
    if (!planName.trim() || selectedDays.length === 0 || exercises.length === 0) {
      Alert.alert('Uzupełnij wszystkie pola.');
      return;
    }

    try {
      const session = await AsyncStorage.getItem('session');
      if (!session) throw new Error('Brak sesji użytkownika');

      const user = JSON.parse(session);

      const result = await db.runAsync(
        `INSERT INTO plans (userId, name, days) VALUES (?, ?, ?)`,
        [user.id, planName, JSON.stringify(selectedDays)]
      );

      const planId = result.lastInsertRowId as number;

      for (const ex of exercises) {
        await db.runAsync(
          `INSERT INTO plan_exercises (planId, name, sets, repsRange) VALUES (?, ?, ?, ?)`,
          [
            planId,
            ex.name.trim(),
            parseInt(ex.sets || '0'),
            `${ex.repsMin.trim()}-${ex.repsMax.trim()}`
          ]
        );
      }

      Alert.alert('Plan zapisany!');
      router.replace('/(tabs)/workouts');
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd zapisu planu.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nowy plan treningowy</Text>

      <TextInput
        style={styles.input}
        placeholder="Nazwa planu"
        placeholderTextColor="#999"
        value={planName}
        onChangeText={setPlanName}
      />

      <Text style={styles.sectionTitle}>Wybierz dni tygodnia:</Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map(day => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.daySelected,
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Ćwiczenia:</Text>
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nazwa ćwiczenia"
            placeholderTextColor="#999"
            value={exercise.name}
            onChangeText={text => updateExercise(index, 'name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Liczba serii"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={exercise.sets}
            onChangeText={text => updateExercise(index, 'sets', text)}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Min powt."
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={exercise.repsMin}
              onChangeText={text => updateExercise(index, 'repsMin', text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Max powt."
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={exercise.repsMax}
              onChangeText={text => updateExercise(index, 'repsMax', text)}
            />
            <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => {
                    const updated = [...exercises];
                    updated.splice(index, 1);
                    setExercises(updated);
                }}
                >
                <Text style={{ color: 'tomato' }}>Usuń ćwiczenie</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addExercise}>
        <Text style={styles.addBtnText}>Dodaj ćwiczenie</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={savePlan}>
        <Text style={styles.saveBtnText}>Zapisz plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1f1f1f',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 12,
    color: '#ccc',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayButton: {
    borderColor: '#444',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  daySelected: {
    backgroundColor: '#10b981',
  },
  dayText: {
    color: '#fff',
  },
  exerciseContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  addBtn: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  addBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});