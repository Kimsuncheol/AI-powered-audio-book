import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';

export default function AuthorDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, userProfile } = useAuth();

  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';

  const stats = [
    { label: 'Published Books', value: '0', icon: 'book.fill', color: '#007AFF' },
    { label: 'Total Listeners', value: '0', icon: 'person.2.fill', color: '#34C759' },
    { label: 'Total Revenue', value: '$0', icon: 'dollarsign.circle.fill', color: '#FF9500' },
    { label: 'Avg. Rating', value: '0.0', icon: 'star.fill', color: '#FFD700' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.greeting}>
              Welcome, {user?.displayName || 'Author'}!
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Here's your author dashboard
            </ThemedText>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: colors.tint }]}>
            <IconSymbol size={16} name="pencil" color="#FFFFFF" />
            <ThemedText style={styles.roleBadgeText}>Author</ThemedText>
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
            Quick Actions
          </ThemedText>
          <View style={styles.actionsGrid}>
            <Pressable style={[styles.actionCard, { backgroundColor: cardBgColor }]}>
              <IconSymbol size={32} name="plus.circle.fill" color={colors.tint} />
              <ThemedText style={styles.actionText}>Upload New Book</ThemedText>
            </Pressable>
            <Pressable style={[styles.actionCard, { backgroundColor: cardBgColor }]}>
              <IconSymbol size={32} name="chart.bar.fill" color={colors.tint} />
              <ThemedText style={styles.actionText}>View Analytics</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Activity
          </ThemedText>
          <View style={[styles.emptyState, { backgroundColor: cardBgColor }]}>
            <IconSymbol size={48} name="tray" color={colors.icon} />
            <ThemedText style={styles.emptyText}>No recent activity</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Your recent uploads and updates will appear here
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
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
