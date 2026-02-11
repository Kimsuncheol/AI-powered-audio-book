import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DashboardStats } from "@/types/admin";
import { getDashboardStats } from "@/utils/admin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminDashboard() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const cardBorderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    onPress,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    onPress?: () => void;
  }) => (
    <Pressable
      style={[
        styles.statCard,
        { backgroundColor: cardBgColor, borderColor: cardBorderColor },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <IconSymbol name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.statContent}>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        <ThemedText style={styles.statTitle}>{title}</ThemedText>
      </View>
    </Pressable>
  );

  const QuickActionCard = ({
    title,
    description,
    icon,
    onPress,
  }: {
    title: string;
    description: string;
    icon: any;
    onPress: () => void;
  }) => (
    <Pressable
      style={[
        styles.actionCard,
        { backgroundColor: cardBgColor, borderColor: cardBorderColor },
      ]}
      onPress={onPress}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: colors.tint }]}>
        <IconSymbol name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.actionContent}>
        <ThemedText style={styles.actionTitle}>{title}</ThemedText>
        <ThemedText style={styles.actionDescription}>{description}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.icon} />
    </Pressable>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Admin Dashboard
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Welcome back, {user?.displayName}!
            </ThemedText>
          </View>

          {/* Stats Overview */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Overview</ThemedText>
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon="person.2.fill"
                color="#007AFF"
                onPress={() => router.push("/(admin-tabs)/users")}
              />
              <StatCard
                title="Authors"
                value={stats?.totalAuthors || 0}
                icon="person.text.rectangle.fill"
                color="#34C759"
              />
              <StatCard
                title="Audiobooks"
                value={stats?.totalAudiobooks || 0}
                icon="book.fill"
                color="#FF9500"
              />
              <StatCard
                title="Pending Content"
                value={stats?.pendingContent || 0}
                icon="clock.fill"
                color="#FF3B30"
                onPress={() => router.push("/(admin-tabs)/content")}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
            <View style={styles.actionsContainer}>
              <QuickActionCard
                title="Manage Users"
                description="View and manage user accounts"
                icon="person.2.circle.fill"
                onPress={() => router.push("/(admin-tabs)/users")}
              />
              <QuickActionCard
                title="Review Content"
                description="Moderate pending audiobooks"
                icon="checkmark.circle.fill"
                onPress={() => router.push("/(admin-tabs)/content")}
              />
              <QuickActionCard
                title="View Analytics"
                description="Platform insights and metrics"
                icon="chart.bar.fill"
                onPress={() => router.push("/(admin-tabs)/reports")}
              />
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
            <View
              style={[
                styles.activityContainer,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <View
                    key={activity.id}
                    style={[
                      styles.activityItem,
                      index !== 4 && styles.activityItemBorder,
                      { borderBottomColor: cardBorderColor },
                    ]}
                  >
                    <View style={styles.activityInfo}>
                      <ThemedText style={styles.activityDetails}>
                        {activity.details}
                      </ThemedText>
                      <ThemedText style={styles.activityTime}>
                        {formatRelativeTime(activity.timestamp)}
                      </ThemedText>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyActivity}>
                  <ThemedText style={styles.emptyActivityText}>
                    No recent activity
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  activityContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
  },
  activityInfo: {
    flex: 1,
  },
  activityDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  emptyActivity: {
    padding: 32,
    alignItems: "center",
  },
  emptyActivityText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
