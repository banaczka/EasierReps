import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { auth } from '../../lib/firebase';

export default function DashboardScreen() {
  // const username = auth.currentUser?.displayName ?? auth.currentUser?.email ?? 'Użytkowniku';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Witaj!</Text>
      <Text style={styles.subtitle}>Gotowy na trening?</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Rozpocznij trening</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
