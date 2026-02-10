import { ThemedText } from "@/components/themed-text";
import { StyleSheet, Switch, View } from "react-native";

interface SettingToggleItemProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: {
    icon: string;
    tint: string;
  };
  cardBgColor: string;
}

export function SettingToggleItem({
  label,
  description,
  value,
  onValueChange,
  colors,
  cardBgColor,
}: SettingToggleItemProps) {
  return (
    <View style={[styles.settingItem, { backgroundColor: cardBgColor }]}>
      <View style={styles.settingLeft}>
        <View style={styles.settingText}>
          <ThemedText style={styles.settingLabel}>{label}</ThemedText>
          <ThemedText style={styles.settingDescription}>
            {description}
          </ThemedText>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: colors.tint }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});
