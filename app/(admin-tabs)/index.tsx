import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';

export default function AdminDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';

  const stats = [
    { label: 'Total Users', value: '0', icon: 'person.3.fill', color: '#007AFF' },
    { label: 'Total Books', value: '0', icon: 'books.vertical.fill', color: '#34C759' },
    { label: 'Active Authors', value: '0', icon: 'pencil.circle.fill', color: '#FF9500' },
    { label: 'Revenue', value: '$0', icon: 'dollarsign.circle.fill', color: '#FFD700' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.greeting}>
              Admin Dashboard
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Welcome back, {user?.displayName}
            </ThemedText>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: '#FF3B30' }]}>
            <IconSymbol size={16} name="shield.fill" color="#FFFFFF" />
            <ThemedText style={styles.roleBadgeText}>Admin</ThemedText>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: cardBgColor }]}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <IconSymbol size={24} name={stat.icon as any} color={stat.color} />
              </View>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Platform Overview
          </ThemedText>
          <View style={[styles.emptyState, { backgroundColor: cardBgColor }]}>
            <IconSymbol size={48} name="chart.line.uptrend.xyaxis" color={colors.icon} />
            <ThemedText style={styles.emptyText}>Analytics Coming Soon</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Platform analytics and insights will be available soon
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Activity
          </ThemedText>
          <View style={[styles.emptyState, { backgroundColor: cardBgColor }]}>
            <IconSymbol size={48} name="clock" color={colors.icon} />
            <ThemedText style={styles.emptyText}>No recent activity</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Recent platform activities will appear here
            </ThemedText>
          </View>
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
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
