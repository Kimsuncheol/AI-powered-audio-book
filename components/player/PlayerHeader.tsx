import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface PlayerHeaderProps {
  onBack: () => void;
  onMenuPress: () => void;
  colors: {
    text: string;
  };
}

export function PlayerHeader({
  onBack,
  onMenuPress,
  colors,
}: PlayerHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.headerButton} onPress={onBack}>
        <IconSymbol size={24} name="chevron.down" color={colors.text} />
      </Pressable>
      <ThemedText style={styles.headerTitle}>Now Playing</ThemedText>
      <Pressable style={styles.headerButton} onPress={onMenuPress}>
        <IconSymbol size={24} name="ellipsis.circle" color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
