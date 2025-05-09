import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { loginUser } from '../lib/auth';
// import { isUserLoggedIn } from '../lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  // useEffect(() => {
  //   const check = async () => {
  //     const loggedIn = await isUserLoggedIn();
  //     if (loggedIn) {
  //       router.replace('/(tabs)/dashboard');
  //     }
  //   };
  //   check();
  // }, []);

//   const handleLogin = async () => {
//   try {
//     await loginUser(email, password);
//     router.replace('/(tabs)/dashboard');
//   } catch (error: any) {
//     Alert.alert('Błąd logowania', error.message);
//   }
// };


const handleLogin = () => {
  // Logowanie na sztywno
  if (username === 'admin' && password === '1234') {
    setError('');
    router.push('/dashboard');
  } else {
    setError('Nieprawidłowe dane logowania');
  }
};

  return (
      <View style={styles.card}>
        <Text style={styles.title}>Easier Reps</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
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
        {error ? <Text>{error}</Text> : null}

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
