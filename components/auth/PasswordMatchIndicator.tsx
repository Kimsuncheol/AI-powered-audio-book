import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, View } from "react-native";

interface PasswordMatchIndicatorProps {
  password: string;
  confirmPassword: string;
}

export function PasswordMatchIndicator({
  password,
  confirmPassword,
}: PasswordMatchIndicatorProps) {
  if (confirmPassword.length === 0) return null;

  const passwordsMatch = password === confirmPassword;

  return (
    <View style={styles.matchIndicator}>
      <IconSymbol
        size={14}
        name={passwordsMatch ? "checkmark.circle.fill" : "xmark.circle.fill"}
        color={passwordsMatch ? "#34C759" : "#FF3B30"}
      />
      <ThemedText
        style={[
          styles.matchText,
          {
            color: passwordsMatch ? "#34C759" : "#FF3B30",
          },
        ]}
      >
        {passwordsMatch ? "Passwords match" : "Passwords do not match"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  matchIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  matchText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
