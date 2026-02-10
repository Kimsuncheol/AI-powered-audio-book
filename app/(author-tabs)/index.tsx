import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';

export default function AuthorDashboard() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Author Dashboard</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome, {user?.displayName}!</ThemedText>
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.placeholder}>Dashboard coming soon...</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    opacity: 0.7,
  },
});
