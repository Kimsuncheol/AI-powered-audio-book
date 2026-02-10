import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";

interface LibraryHeaderProps {
  userName: string;
  isGuest: boolean;
}

export function LibraryHeader({ userName, isGuest }: LibraryHeaderProps) {
  const displayName = isGuest ? "Guest" : userName || "Reader";

  return (
    <View style={styles.header}>
      <View>
        <ThemedText type="title" style={styles.greeting}>
          Hello, {displayName}!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          What will you listen to today?
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});
