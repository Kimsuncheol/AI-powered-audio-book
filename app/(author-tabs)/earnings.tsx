import { EarningsSummary } from "@/components/author/earnings/EarningsSummary";
import { MonthlyBreakdown } from "@/components/author/earnings/MonthlyBreakdown";
import { PayoutHistory } from "@/components/author/earnings/PayoutHistory";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_MONTHS = [
  { month: "February 2026", amount: "$620", books: 3 },
  { month: "January 2026", amount: "$580", books: 3 },
  { month: "December 2025", amount: "$510", books: 3 },
  { month: "November 2025", amount: "$475", books: 2 },
  { month: "October 2025", amount: "$445", books: 2 },
];

const MOCK_PAYOUTS = [
  {
    id: "1",
    date: "Feb 1, 2026",
    amount: "$620.00",
    status: "processing" as const,
  },
  {
    id: "2",
    date: "Jan 1, 2026",
    amount: "$580.00",
    status: "completed" as const,
  },
  {
    id: "3",
    date: "Dec 1, 2025",
    amount: "$510.00",
    status: "completed" as const,
  },
  {
    id: "4",
    date: "Nov 1, 2025",
    amount: "$475.00",
    status: "completed" as const,
  },
];

export default function EarningsScreen() {
  const colorScheme = useColorScheme();
  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Earnings
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Track your revenue and payouts
            </ThemedText>
          </View>

          <EarningsSummary
            totalEarnings="$3,280"
            thisMonth="$620"
            lastMonth="$580"
            cardBgColor={cardBgColor}
          />

          <MonthlyBreakdown months={MOCK_MONTHS} cardBgColor={cardBgColor} />

          <PayoutHistory payouts={MOCK_PAYOUTS} cardBgColor={cardBgColor} />
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
