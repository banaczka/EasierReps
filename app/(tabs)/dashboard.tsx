import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { db } from '../../lib/firebase';

export default function DashboardScreen() {
  
  const testFirebaseConnection = async () => {
    try {
      const docRef = doc(collection(db, "testCollection"), "testDoc");
      await setDoc(docRef, { message: "Hello from Firebase!" });
  
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        Alert.alert("Sukces", `Dane: ${JSON.stringify(docSnap.data())}`);
      } else {
        Alert.alert("Brak danych", "Dokument nie istnieje.");
      }
    } catch (error) {
      Alert.alert("Błąd", error instanceof Error ? error.message : String(error));
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Button title="Test Firebase" onPress={testFirebaseConnection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
});
