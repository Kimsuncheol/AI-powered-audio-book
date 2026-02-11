import { AnalyticsOverview } from "@/components/author/analytics/AnalyticsOverview";
import { ListeningTrends } from "@/components/author/analytics/ListeningTrends";
import { TopBooks } from "@/components/author/analytics/TopBooks";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_OVERVIEW = [
  {
    label: "Total Plays",
    value: "45.2K",
    icon: "play.circle.fill",
    iconColor: "#007AFF",
    change: "+12%",
    changePositive: true,
  },
  {
    label: "Unique Listeners",
    value: "8,340",
    icon: "person.2.fill",
    iconColor: "#AF52DE",
    change: "+8%",
    changePositive: true,
  },
  {
    label: "Hours Played",
    value: "1,250",
    icon: "clock.fill",
    iconColor: "#FF9500",
    change: "+15%",
    changePositive: true,
  },
  {
    label: "Revenue",
    value: "$3,280",
    icon: "dollarsign.circle.fill",
    iconColor: "#34C759",
    change: "+5%",
    changePositive: true,
  },
];

const MOCK_TOP_BOOKS = [
  { id: "1", title: "The Silent Echo", listens: 15234, revenue: "$1,245" },
  { id: "2", title: "Midnight Whispers", listens: 10120, revenue: "$890" },
  { id: "3", title: "Ocean Dreams", listens: 8450, revenue: "$720" },
  { id: "4", title: "Starlight Memories", listens: 6200, revenue: "$425" },
];

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Analytics
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Track your audiobook performance
            </ThemedText>
          </View>

          <AnalyticsOverview stats={MOCK_OVERVIEW} cardBgColor={cardBgColor} />

          <TopBooks
            books={MOCK_TOP_BOOKS}
            cardBgColor={cardBgColor}
            tintColor={colors.tint}
          />

          <ListeningTrends tintColor={colors.tint} cardBgColor={cardBgColor} />
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
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.6,
  },
});
