import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View, ViewStyle } from "react-native";

interface FavoritesHeaderProps {
  count: number;
  style?: ViewStyle;
}

export function FavoritesHeader({ count, style }: FavoritesHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <ThemedText type="title" style={styles.title}>
        Favorites
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {count} {count === 1 ? "book" : "books"} saved
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});
