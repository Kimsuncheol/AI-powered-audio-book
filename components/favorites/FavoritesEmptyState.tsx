import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface FavoritesEmptyStateProps {
  isGuest: boolean;
  colors: {
    tint: string;
    icon: string;
  };
  onSignUpPress: () => void;
}

export function FavoritesEmptyState({
  isGuest,
  colors,
  onSignUpPress,
}: FavoritesEmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View
        style={[styles.iconContainer, { backgroundColor: colors.tint + "20" }]}
      >
        <IconSymbol
          size={48}
          name={isGuest ? "lock.fill" : "heart"}
          color={isGuest ? colors.tint : colors.icon}
        />
      </View>
      <ThemedText style={styles.emptyText}>
        {isGuest ? "Sign Up to Save Favorites" : "No favorites yet"}
      </ThemedText>
      <ThemedText style={styles.emptySubtext}>
        {isGuest
          ? "Create a free account to save your favorite audiobooks and access them across all your devices."
          : "Tap the heart icon on any book to save it here"}
      </ThemedText>
      {isGuest && (
        <Pressable
          style={[styles.signUpButton, { backgroundColor: colors.tint }]}
          onPress={onSignUpPress}
        >
          <ThemedText style={styles.signUpButtonText}>
            Create Free Account
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  signUpButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
