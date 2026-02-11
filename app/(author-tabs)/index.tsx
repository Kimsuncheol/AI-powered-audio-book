import { AuthorStatsGrid } from "@/components/author/dashboard/AuthorStatsGrid";
import { QuickActions } from "@/components/author/dashboard/QuickActions";
import { RecentActivity } from "@/components/author/dashboard/RecentActivity";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_STATS = [
  {
    label: "Total Books",
    value: "12",
    icon: "books.vertical.fill",
    iconColor: "#007AFF",
  },
  {
    label: "Total Listens",
    value: "45.2K",
    icon: "headphones",
    iconColor: "#34C759",
  },
  {
    label: "Revenue",
    value: "$3,280",
    icon: "dollarsign.circle.fill",
    iconColor: "#FF9500",
  },
  {
    label: "Avg Rating",
    value: "4.7",
    icon: "star.fill",
    iconColor: "#FFCC00",
  },
];

const MOCK_ACTIVITIES = [
  {
    id: "1",
    title: "New Review",
    description: '"The Silent Echo" received a 5-star review',
    time: "2h ago",
    icon: "star.fill",
    iconColor: "#FFCC00",
  },
  {
    id: "2",
    title: "Milestone Reached",
    description: '"Midnight Whispers" hit 10K listens',
    time: "5h ago",
    icon: "flag.fill",
    iconColor: "#34C759",
  },
  {
    id: "3",
    title: "Payout Processed",
    description: "$450.00 deposited to your account",
    time: "1d ago",
    icon: "dollarsign.circle.fill",
    iconColor: "#007AFF",
  },
  {
    id: "4",
    title: "Book Approved",
    description: '"Ocean Dreams" is now live',
    time: "2d ago",
    icon: "checkmark.circle.fill",
    iconColor: "#34C759",
  },
];

export default function AuthorDashboard() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user } = useAuth();
  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  const quickActions = [
    {
      label: "Upload Book",
      icon: "plus.circle.fill",
      color: colors.tint,
      onPress: () => router.push("/(author-tabs)/upload"),
    },
    {
      label: "View Analytics",
      icon: "chart.line.uptrend.xyaxis",
      color: "#FF9500",
      onPress: () => router.push("/(author-tabs)/analytics"),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
            <ThemedText type="title" style={styles.name}>
              {user?.displayName || "Author"}
            </ThemedText>
          </View>

          <AuthorStatsGrid stats={MOCK_STATS} cardBgColor={cardBgColor} />

          <QuickActions actions={quickActions} cardBgColor={cardBgColor} />

          <RecentActivity
            activities={MOCK_ACTIVITIES}
            cardBgColor={cardBgColor}
          />
        </ScrollView>
      </SafeAreaView>
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
  },
  greeting: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
  },
});
