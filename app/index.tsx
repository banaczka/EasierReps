import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { db } from '@/lib/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem('session');
      if (session) {
        router.replace('/(tabs)/dashboard');
      }
    };
  
    checkSession();
  }, []);

  const hashPassword = async (password: string) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

  const handleLogin = async () => {
    if (!email || !password) return alert('Wpisz dane logowania');
  
    try {
      const hashedInput = await hashPassword(password);
      const user = await db.getFirstAsync(
        `SELECT * FROM users WHERE email = ? AND password = ?`,
        [email.trim(), hashedInput]
      );
  
      if (user) {
        await AsyncStorage.setItem('session', JSON.stringify(user));
        router.replace('/(tabs)/dashboard');
      } else {
        alert('Nieprawidłowy email lub hasło');
      }
    } catch (err) {
      console.error('Błąd logowania:', err);
      alert('Coś poszło nie tak przy logowaniu');
    }
  };

  return (
      <View style={styles.card}>
        <Text style={styles.title}>Easier Reps</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Hasło"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Zaloguj się</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.button]} onPress={() => router.push('/register')}>
          <Text style={styles.buttonText}>Zarejestruj się</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#ffffff',
  },
  input: {
    height: 48,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: '#fff',
    backgroundColor: '#2c2c2c',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
