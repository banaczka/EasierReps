import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user && user.email) {
        const extractedUsername = user.email.split('@')[0];
        setUsername(extractedUsername);
      } else {
        router.replace('/');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil Użytkownika {username}</Text>
      <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/history')}>
        <Text style={styles.historyButtonText}>Historia treningów</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.caloriesButton} onPress={() => router.push('/calories')}>
        <Text style={styles.caloriesText}>Licznik Kalorii</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.caloriesButton} onPress={() => router.push('/set-reminder')}>
        <Text style={styles.caloriesText}>Ustaw przypomnienie o suplementach</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={() => auth.signOut()}>
        <Text style={styles.logoutText}>Wyloguj się</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  historyButton: { 
    backgroundColor: '#10b981', 
    padding: 16, 
    margin: 8, 
    borderRadius: 8 
  },
  historyButtonText: { 
    color: '#fff', 
    fontSize: 18 
  },
  logoutButton: { 
    backgroundColor: '#6200ee', 
    padding: 16, 
    margin: 8, 
    borderRadius: 8 
  },
  logoutText: { 
    color: '#fff', 
    fontSize: 18 
  },
  caloriesButton: {
    backgroundColor: '#10b981', 
    padding: 16, 
    margin: 8, 
    borderRadius: 8
  },
  caloriesText: {
    color: '#fff', 
    fontSize: 18
  }
});

