import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const session = await AsyncStorage.getItem('session');
      if (session) {
        const user = JSON.parse(session);
        setUsername(user.username);
      }
    };

    loadUser();
  })

  const handleLogout = async () => {
    await AsyncStorage.removeItem('session');
    Alert.alert('Wylogowano');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil użytkownika {username}</Text>
      <Button title="Wyloguj się" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#121212',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#fff',
  },
});
