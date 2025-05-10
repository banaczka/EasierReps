import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserPlans } from '../lib/firebase';

export default function SelectWorkoutScreen() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);

  const loadPlans = async () => {
    try {
      const userPlans = await getUserPlans();
      setPlans(userPlans);
    } catch (error) {
      console.error('Błąd ładowania planów:', error);
      Alert.alert('Błąd', 'Nie udało się załadować planów.');
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz plan treningowy</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.planItem}
            onPress={() => router.push({ pathname: '/active-workout', params: { planId: item.id } })}
          >
            <Text style={styles.planName}>{item.name}</Text>
            <Text style={styles.planDays}>{item.days.join(', ')}</Text>
            <FlatList
              data={item.exercises}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.exercise}>{item.name} - {item.sets}x ({item.repsRange})</Text>
              )}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  planItem: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    color: '#fff',
  },
  planDays: {
    fontSize: 14,
    color: '#aaa',
  },
  exercise: {
    color: '#fff',
    marginLeft: 10
},
});
