import { StyleSheet, View } from "react-native";

interface PasswordStrengthIndicatorProps {
  strength: {
    strength: "weak" | "medium" | "strong";
    color: string;
  } | null;
}

export function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps) {
  if (!strength) return null;

  return (
    <View style={styles.strengthIndicator}>
      <View
        style={[
          styles.strengthBar,
          {
            width:
              strength.strength === "weak"
                ? "33%"
                : strength.strength === "medium"
                  ? "66%"
                  : "100%",
            backgroundColor: strength.color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  strengthIndicator: {
    height: 4,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    borderRadius: 2,
  },
});
