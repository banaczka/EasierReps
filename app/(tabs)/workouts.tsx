import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getUserPlans, deletePlan } from '../../lib/planService';

export default function WorkoutsScreen() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadPlans = async () => {
        try {
          const results = await getUserPlans();
          setPlans(results);
        } catch (error) {
          console.error('Błąd ładowania planów:', error);
        }
      };
  
      loadPlans();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twoje plany treningowe</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/new-plan')}
      >
        <Text style={styles.buttonText}>Dodaj nowy plan</Text>
      </TouchableOpacity>

      {plans.length === 0 ? (
        <Text style={styles.noPlans}>Brak planów treningowych.</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.planItem}>
              <Text style={styles.planName}>{item.name}</Text>
              <Text style={styles.planDays}>
                {Array.isArray(item.days) ? item.days.join(', ') : ''}
              </Text>
              <TouchableOpacity
      style={styles.deleteButton}
      onPress={async () => {
        Alert.alert(
          'Usuń plan',
          `Czy na pewno chcesz usunąć plan "${item.name}"?`,
          [
            { text: 'Anuluj', style: 'cancel' },
            {
              text: 'Usuń',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deletePlan(item.id);
                  setPlans(prev => prev.filter(p => p.id !== item.id));
                } catch (e) {
                  console.error('Błąd usuwania:', e);
                }
              }
            }
          ]
        );
      }}
    >
      <Text style={styles.deleteButtonText}>Usuń</Text>
    </TouchableOpacity>
            </View>
          )}
        />
      )}
      
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
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noPlans: {
    color: '#ccc',
    marginTop: 20,
  },
  planItem: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  planDays: {
    color: '#aaa',
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: 'tomato',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
