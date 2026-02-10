import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function UploadScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Upload Audiobook
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Share your audiobook with listeners
          </ThemedText>
        </View>

        <View style={styles.comingSoon}>
          <IconSymbol size={80} name="arrow.up.doc.fill" color={colors.tint} />
          <ThemedText style={styles.comingSoonText}>Coming Soon</ThemedText>
          <ThemedText style={styles.comingSoonSubtext}>
            Upload functionality will be available soon
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  comingSoon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  comingSoonSubtext: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
