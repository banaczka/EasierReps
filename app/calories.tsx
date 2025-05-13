import { deleteMeal, getTodayMeals, saveMealToFirestore } from '@/lib/firebase';
import { fetchCalories } from '@/lib/nutrition';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      if (cal === null) {
        Alert.alert('Błąd', 'Nie znaleziono produktu w bazie danych.');
        return;
      }
      setCalories(cal);
      const saveResult = await saveMealToFirestore(food, cal);
      if (saveResult !== null) {
        Alert.alert('Zapisano!', `Dodano ${food} (${cal} kcal)`);
        const mealsData = await getTodayMeals();
        setMeals(mealsData);
        setTodayCalories((prev) => prev + cal);
      } else {
        Alert.alert('Błąd', 'Nie udało się zapisać posiłku.');
      }
    } catch (error: any) {
      console.error('Błąd:', error.message);
      Alert.alert('Błąd', 'Wystąpił problem z połączeniem.');
    }
  };

  const handleDeleteMeal = async (mealId: string, mealCalories: number) => {
    try {
      await deleteMeal(mealId);
      Alert.alert('Sukces', 'Posiłek został usunięty.');
      setTodayCalories((prev) => prev - mealCalories);
      setMeals((prev) => prev.filter(meal => meal.id !== mealId));
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się usunąć posiłku.');
      console.error("Błąd usuwania posiłku:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Twoje kalorie</Text>
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
          <View style={styles.mealItemContainer}>
            <Text style={styles.mealItem}>{item.name} - {item.calories} kcal</Text>
            <TouchableOpacity onPress={() => handleDeleteMeal(item.id, item.calories)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Usuń</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      justifyContent: 'center', 
      padding: 24, 
      backgroundColor: '#121212' 
    },
    title: { 
      fontSize: 28, 
      color: '#fff', 
      marginBottom: 16, 
      textAlign: 'center' 
    },
    subtitle: { 
      fontSize: 20, 
      color: '#10b981', 
      marginBottom: 16, 
      textAlign: 'center' 
    },
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
    buttonText: { 
      color: '#fff', 
      fontSize: 18 
    },
    mealItem: { 
      color: '#fff', 
      fontSize: 18, 
      marginTop: 8, 
      textAlign: 'center' 
    },
    mealItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#1e1e1e',
      borderRadius: 8,
    },
    deleteButton: {
      backgroundColor: '#ff4d4d',
      padding: 8,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });