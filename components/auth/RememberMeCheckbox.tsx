import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Pressable, StyleSheet, View } from "react-native";

interface RememberMeCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export function RememberMeCheckbox({
  checked,
  onToggle,
}: RememberMeCheckboxProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? colors.tint : "transparent",
            borderColor: checked ? colors.tint : colors.icon,
          },
        ]}
      >
        {checked && (
          <IconSymbol
            size={14}
            name="checkmark"
            color={colorScheme === "dark" ? "#000000" : "#FFFFFF"}
          />
        )}
      </View>
      <ThemedText style={styles.label}>Remember my email</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
  },
});
