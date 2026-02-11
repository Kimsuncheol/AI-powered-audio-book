import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface EmptyBooksStateProps {
  tintColor: string;
}

export function EmptyBooksState({ tintColor }: EmptyBooksStateProps) {
  return (
    <View style={styles.container}>
      <IconSymbol size={80} name="books.vertical.fill" color={tintColor} />
      <ThemedText style={styles.title}>No Books Yet</ThemedText>
      <ThemedText style={styles.subtitle}>
        Upload your first audiobook to get started
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: "center",
  },
});
