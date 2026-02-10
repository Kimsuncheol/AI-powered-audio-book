import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";

export function ExploreHeader() {
  return (
    <View style={styles.header}>
      <ThemedText type="title" style={styles.title}>
        Discover
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Find your next great audiobook
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});
