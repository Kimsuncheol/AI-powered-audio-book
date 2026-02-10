import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Analytics
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Track your audiobook performance
          </ThemedText>
        </View>

        <View style={styles.comingSoon}>
          <IconSymbol size={80} name="chart.line.uptrend.xyaxis" color={colors.tint} />
          <ThemedText style={styles.comingSoonText}>Coming Soon</ThemedText>
          <ThemedText style={styles.comingSoonSubtext}>
            Detailed analytics and insights will be available soon
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
