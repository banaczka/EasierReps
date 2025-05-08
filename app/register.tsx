import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
// import { registerUser } from '../lib/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (!email || !username || !password || password !== confirm) {
      Alert.alert('Błąd', 'Uzupełnij poprawnie wszystkie pola');
      return;
    }

    // try {
    //   await registerUser(email, password, username);
    //   router.replace('/');
    // } catch (error: any) {
    //   Alert.alert('Błąd rejestracji', error.message);
    // }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rejestracja</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Nazwa użytkownika"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Hasło"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Powtórz hasło"
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

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
