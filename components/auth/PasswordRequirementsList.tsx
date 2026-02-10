import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, View } from "react-native";

interface PasswordRequirementsListProps {
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function PasswordRequirementsList({
  requirements,
}: PasswordRequirementsListProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const requirementsList = [
    { key: "minLength", text: "At least 8 characters" },
    { key: "hasUpperCase", text: "One uppercase letter" },
    { key: "hasLowerCase", text: "One lowercase letter" },
    { key: "hasNumber", text: "One number" },
    { key: "hasSpecialChar", text: "One special character" },
  ] as const;

  return (
    <View style={styles.requirementsList}>
      {requirementsList.map((req) => {
        const isMet = requirements[req.key];
        return (
          <View key={req.key} style={styles.requirementItem}>
            <IconSymbol
              size={14}
              name={isMet ? "checkmark.circle.fill" : "circle"}
              color={isMet ? "#34C759" : colors.icon}
            />
            <ThemedText
              style={[styles.requirementText, isMet && styles.requirementMet]}
            >
              {req.text}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  requirementsList: {
    gap: 6,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
    opacity: 0.7,
  },
  requirementMet: {
    opacity: 1,
    color: "#34C759",
  },
});
