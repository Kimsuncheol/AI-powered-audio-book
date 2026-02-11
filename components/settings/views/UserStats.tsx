import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, View } from "react-native";

interface UserStatsProps {
  cardBgColor: string;
}

export function UserStats({ cardBgColor }: UserStatsProps) {
  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, { backgroundColor: cardBgColor }]}>
        <ThemedText style={styles.statNumber}>0</ThemedText>
        <ThemedText style={styles.statLabel}>Books</ThemedText>
      </View>
      <View style={[styles.statCard, { backgroundColor: cardBgColor }]}>
        <ThemedText style={styles.statNumber}>0h</ThemedText>
        <ThemedText style={styles.statLabel}>Listening Time</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
});
