import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { PlatformAnalytics } from "@/types/admin";
import { getPlatformAnalytics } from "@/utils/admin";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const cardBorderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getPlatformAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    trend,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color: string;
    trend?: number;
  }) => (
    <View
      style={[
        styles.metricCard,
        { backgroundColor: cardBgColor, borderColor: cardBorderColor },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <IconSymbol name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.metricContent}>
        <ThemedText style={styles.metricTitle}>{title}</ThemedText>
        <ThemedText style={styles.metricValue}>{value}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.metricSubtitle}>{subtitle}</ThemedText>
        )}
        {trend !== undefined && (
          <View style={styles.trendContainer}>
            <IconSymbol
              name={trend >= 0 ? "arrow.up.right" : "arrow.down.right"}
              size={14}
              color={trend >= 0 ? "#34C759" : "#FF3B30"}
            />
            <ThemedText
              style={[
                styles.trendText,
                { color: trend >= 0 ? "#34C759" : "#FF3B30" },
              ]}
            >
              {Math.abs(trend)}%
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {subtitle && (
        <ThemedText style={styles.sectionSubtitle}>{subtitle}</ThemedText>
      )}
    </View>
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
              Reports & Analytics
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Platform insights and performance metrics
            </ThemedText>
          </View>

          {/* Platform Overview */}
          <SectionHeader
            title="Platform Overview"
            subtitle="Key performance indicators"
          />
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Users"
              value={analytics?.overview.activeUsers || 0}
              subtitle="Active users"
              icon="person.2.fill"
              color="#007AFF"
              trend={analytics?.overview.userGrowthRate || 0}
            />
            <MetricCard
              title="Total Plays"
              value={formatNumber(analytics?.overview.totalPlays || 0)}
              subtitle="All time"
              icon="play.circle.fill"
              color="#34C759"
            />
            <MetricCard
              title="Listening Hours"
              value={formatNumber(analytics?.overview.totalListeningHours || 0)}
              subtitle="Total hours"
              icon="clock.fill"
              color="#FF9500"
            />
            <MetricCard
              title="Avg Session"
              value={`${Math.round(analytics?.overview.averageSessionDuration || 0)}m`}
              subtitle="Duration"
              icon="timer"
              color="#AF52DE"
            />
          </View>

          {/* User Metrics */}
          <SectionHeader title="User Engagement" subtitle="User activity metrics" />
          <View
            style={[
              styles.statsCard,
              { backgroundColor: cardBgColor, borderColor: cardBorderColor },
            ]}
          >
            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Daily Active Users</ThemedText>
              <ThemedText style={styles.statValue}>
                {analytics?.userMetrics.dailyActiveUsers || 0}
              </ThemedText>
            </View>
            <View
              style={[styles.divider, { backgroundColor: cardBorderColor }]}
            />
            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>
                Monthly Active Users
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {analytics?.userMetrics.monthlyActiveUsers || 0}
              </ThemedText>
            </View>
            <View
              style={[styles.divider, { backgroundColor: cardBorderColor }]}
            />
            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Retention Rate</ThemedText>
              <ThemedText style={styles.statValue}>
                {analytics?.userMetrics.userRetentionRate.toFixed(1) || 0}%
              </ThemedText>
            </View>
            <View
              style={[styles.divider, { backgroundColor: cardBorderColor }]}
            />
            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>
                Avg Sessions/User
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {analytics?.userMetrics.averageSessionsPerUser.toFixed(1) || 0}
              </ThemedText>
            </View>
          </View>

          {/* Content Metrics */}
          <SectionHeader
            title="Content Performance"
            subtitle="Audiobook statistics"
          />
          <View
            style={[
              styles.statsCard,
              { backgroundColor: cardBgColor, borderColor: cardBorderColor },
            ]}
          >
            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Total Audiobooks</ThemedText>
              <ThemedText style={styles.statValue}>
                {analytics?.contentMetrics.totalBooks || 0}
              </ThemedText>
            </View>
            <View
              style={[styles.divider, { backgroundColor: cardBorderColor }]}
            />
            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>
                Published This Month
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {analytics?.contentMetrics.booksPublishedThisMonth || 0}
              </ThemedText>
            </View>
          </View>

          {/* Top Audiobooks */}
          {analytics?.contentMetrics.topBooks &&
            analytics.contentMetrics.topBooks.length > 0 && (
              <>
                <SectionHeader
                  title="Top Audiobooks"
                  subtitle="Most played content"
                />
                <View
                  style={[
                    styles.listCard,
                    { backgroundColor: cardBgColor, borderColor: cardBorderColor },
                  ]}
                >
                  {analytics.contentMetrics.topBooks
                    .slice(0, 10)
                    .map((book, index) => (
                      <View key={book.id}>
                        <View style={styles.bookRow}>
                          <View style={styles.rankContainer}>
                            <ThemedText style={styles.rankText}>
                              {index + 1}
                            </ThemedText>
                          </View>
                          <View style={styles.bookInfo}>
                            <ThemedText style={styles.bookTitle}>
                              {book.title}
                            </ThemedText>
                            <ThemedText style={styles.bookAuthor}>
                              by {book.author}
                            </ThemedText>
                          </View>
                          <View style={styles.bookStats}>
                            <View style={styles.bookStatItem}>
                              <IconSymbol
                                name="play.fill"
                                size={14}
                                color={colors.icon}
                              />
                              <ThemedText style={styles.bookStatText}>
                                {formatNumber(book.plays)}
                              </ThemedText>
                            </View>
                            <View style={styles.bookStatItem}>
                              <IconSymbol
                                name="star.fill"
                                size={14}
                                color="#FFD60A"
                              />
                              <ThemedText style={styles.bookStatText}>
                                {book.rating.toFixed(1)}
                              </ThemedText>
                            </View>
                          </View>
                        </View>
                        {index < analytics.contentMetrics.topBooks.length - 1 &&
                          index < 9 && (
                            <View
                              style={[
                                styles.divider,
                                { backgroundColor: cardBorderColor },
                              ]}
                            />
                          )}
                      </View>
                    ))}
                </View>
              </>
            )}

          {/* Empty State for No Data */}
          {!analytics?.contentMetrics.topBooks ||
            (analytics.contentMetrics.topBooks.length === 0 && (
              <View
                style={[
                  styles.emptyState,
                  { backgroundColor: cardBgColor, borderColor: cardBorderColor },
                ]}
              >
                <IconSymbol
                  name="chart.bar.doc.horizontal"
                  size={60}
                  color={colors.icon}
                />
                <ThemedText style={styles.emptyText}>
                  No analytics data yet
                </ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Data will appear as users interact with the platform
                </ThemedText>
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
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
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: "47%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  metricContent: {
    gap: 4,
  },
  metricTitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  metricSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  statLabel: {
    fontSize: 15,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    height: 1,
  },
  listCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  bookInfo: {
    flex: 1,
    gap: 4,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  bookAuthor: {
    fontSize: 13,
    opacity: 0.7,
  },
  bookStats: {
    gap: 8,
  },
  bookStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bookStatText: {
    fontSize: 13,
    opacity: 0.8,
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
