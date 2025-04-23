import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { db } from '@/lib/db';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      return Alert.alert('Uzupełnij wszystkie pola');
    }

    if (!isValidEmail(email)) {
        return Alert.alert('Niepoprawny email');
      }

    if (password.length < 8) {
        return Alert.alert('Hasło musi mieć co najmniej 6 znaków');
    }
      

    if (password !== confirm) {
      return Alert.alert('Hasła się nie zgadzają');
    }

    try {
      await db.execAsync(`
        INSERT INTO users (email, password)
        VALUES ('${email.trim()}', '${password}')
      `);

      Alert.alert('Konto utworzone!');
      router.replace('/');
    } catch (err) {
      console.error('Rejestracja nie działa 😭', err);
      Alert.alert('Coś się zepsuło...');
    }
  };

  return (
      <View style={styles.card}>
        <Text style={styles.title}>Rejestracja</Text>

        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#aaa" />
        <TextInput placeholder="Hasło" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#aaa" />
        <TextInput placeholder="Powtórz hasło" style={styles.input} value={confirm} onChangeText={setConfirm} secureTextEntry placeholderTextColor="#aaa" />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#fff',
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
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
