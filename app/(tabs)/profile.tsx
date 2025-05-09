import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
// import { auth } from '../../lib/firebase';
// import { logoutUser } from '../../lib/auth';

export default function ProfileScreen() {
  const router = useRouter();

  // const handleLogout = async () => {
  //   await logoutUser();
  //   router.replace('/');
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {/* Zalogowany jako: {auth.currentUser?.displayName ?? auth.currentUser?.email ?? 'Nieznany użytkownik'} */}
      </Text>
      <Button title="Wyloguj się"/>
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
