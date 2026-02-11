import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface QuickAction {
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
  cardBgColor: string;
}

export function QuickActions({ actions, cardBgColor }: QuickActionsProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
      <View style={styles.actionsRow}>
        {actions.map((action, index) => (
          <Pressable
            key={index}
            style={[styles.actionButton, { backgroundColor: cardBgColor }]}
            onPress={action.onPress}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: action.color + "20" },
              ]}
            >
              <IconSymbol size={24} name={action.icon} color={action.color} />
            </View>
            <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 10,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
