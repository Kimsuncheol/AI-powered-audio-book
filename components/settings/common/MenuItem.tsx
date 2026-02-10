import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  colors: {
    icon: string;
  };
  cardBgColor: string;
  danger?: boolean;
}

export function MenuItem({
  icon,
  label,
  onPress,
  colors,
  cardBgColor,
  danger = false,
}: MenuItemProps) {
  return (
    <Pressable
      style={[
        styles.menuItem,
        { backgroundColor: cardBgColor },
        danger && styles.dangerButton,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <IconSymbol
          size={24}
          name={icon}
          color={danger ? "#FF3B30" : colors.icon}
        />
        <ThemedText style={[styles.menuItemText, danger && styles.dangerText]}>
          {label}
        </ThemedText>
      </View>
      {!danger && (
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
  dangerButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  dangerText: {
    color: "#FF3B30",
  },
});
