import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface SignOutButtonProps {
  onPress: () => void;
}

export function SignOutButton({ onPress }: SignOutButtonProps) {
  return (
    <Pressable
      style={[styles.menuItem, styles.signOutButton]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <IconSymbol
          size={24}
          name="rectangle.portrait.and.arrow.right"
          color="#FF3B30"
        />
        <ThemedText style={[styles.menuItemText, styles.signOutText]}>
          Sign Out
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  signOutText: {
    color: "#FF3B30",
  },
});
