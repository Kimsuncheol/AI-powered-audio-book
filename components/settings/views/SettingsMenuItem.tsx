import { ThemedText } from "@/components/themed-text";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface SettingsMenuItemProps {
  icon: IconSymbolName;
  label: string;
  onPress: () => void;
  colors: typeof Colors.light;
  cardBgColor: string;
  showChevron?: boolean;
}

export function SettingsMenuItem({
  icon,
  label,
  onPress,
  colors,
  cardBgColor,
  showChevron = true,
}: SettingsMenuItemProps) {
  return (
    <Pressable
      style={[styles.menuItem, { backgroundColor: cardBgColor }]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <IconSymbol size={24} name={icon} color={colors.icon} />
        <ThemedText style={styles.menuItemText}>{label}</ThemedText>
      </View>
      {showChevron && (
        <IconSymbol size={20} name="chevron.right" color={colors.icon} />
      )}
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
});
