import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface EmptyStateProps {
  colors: {
    icon: string;
  };
}

export function EmptyState({ colors }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <IconSymbol size={60} name="book" color={colors.icon} />
      <ThemedText style={styles.emptyText}>No books found</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Try adjusting your search query
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
});
