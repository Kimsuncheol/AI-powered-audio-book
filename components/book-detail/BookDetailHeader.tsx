import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface BookDetailHeaderProps {
  onBack: () => void;
  onShare: () => void;
  colors: {
    text: string;
  };
  cardBgColor: string;
}

export function BookDetailHeader({
  onBack,
  onShare,
  colors,
  cardBgColor,
}: BookDetailHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        style={[styles.headerButton, { backgroundColor: cardBgColor }]}
        onPress={onBack}
      >
        <IconSymbol size={24} name="chevron.left" color={colors.text} />
      </Pressable>
      <Pressable
        style={[styles.headerButton, { backgroundColor: cardBgColor }]}
        onPress={onShare}
      >
        <IconSymbol size={24} name="square.and.arrow.up" color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
