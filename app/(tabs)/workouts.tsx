import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../../lib/db';

export default function WorkoutsScreen() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadPlans = async () => {
        const session = await AsyncStorage.getItem('session');
        if (!session) return;

        const user = JSON.parse(session);

        const results = await db.getAllAsync(
          `SELECT * FROM plans WHERE userId = ? ORDER BY createdAt DESC`,
          [user.id]
        );

        setPlans(results);
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
                {JSON.parse(item.days).join(', ')}
              </Text>
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
});
