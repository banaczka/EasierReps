import { getTodayMeals, saveMealToFirestore } from '@/lib/firebase';
import { fetchCalories } from '@/lib/nutrition';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CaloriesScreen() {
  const [food, setFood] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState<number | null>(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const mealsData = await getTodayMeals();
        setMeals(mealsData);

        const totalCalories = mealsData.reduce((sum, meal) => sum + meal.calories, 0);
        setTodayCalories(totalCalories);
      } catch (error) {
        console.error("Błąd ładowania posiłków:", error);
      }
    };
    loadMeals();
  }, []);

  const handleFetchCalories = async () => {
    if (!food || !quantity) {
      Alert.alert('Błąd', 'Podaj produkt i ilość.');
      return;
    }

    try {
      const cal = await fetchCalories(food, parseFloat(quantity));
      setCalories(cal);
      await saveMealToFirestore(food, cal);
      Alert.alert('Zapisano!', `Dodano ${food} (${cal} kcal)`);
      const mealsData = await getTodayMeals();
      setMeals(mealsData);
      setTodayCalories((prev) => prev + cal);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać danych o kaloriach.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Licznik Kalorii</Text>
      <Text style={styles.subtitle}>Dzisiejsza suma: {todayCalories} kcal</Text>
      <TextInput
        style={styles.input}
        placeholder="Nazwa produktu"
        value={food}
        onChangeText={setFood}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Ilość (g)"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleFetchCalories}>
        <Text style={styles.buttonText}>Oblicz i dodaj</Text>
      </TouchableOpacity>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.mealItem}>
            {item.name} - {item.calories} kcal
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#121212' },
    title: { fontSize: 28, color: '#fff', marginBottom: 16, textAlign: 'center' },
    subtitle: { fontSize: 20, color: '#10b981', marginBottom: 16, textAlign: 'center' },
    input: {
      height: 50,
      borderColor: '#333',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      color: '#fff',
      backgroundColor: '#2c2c2c',
    },
    button: {
      backgroundColor: '#3498db',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 18 },
    mealItem: { color: '#fff', fontSize: 18, marginTop: 8, textAlign: 'center' },
  });