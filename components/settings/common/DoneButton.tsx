import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Pressable, StyleSheet } from "react-native";

interface DoneButtonProps {
  onPress: () => void;
  colors: {
    tint: string;
  };
}

export function DoneButton({ onPress, colors }: DoneButtonProps) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#000000" : "#FFFFFF";
  return (
    <Pressable
      style={[styles.doneButton, { backgroundColor: colors.tint }]}
      onPress={onPress}
    >
      <ThemedText style={[styles.doneButtonText, { color }]}>Done</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  doneButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
