import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface ActionButtonsProps {
  onPlay: () => void;
  onDownload: () => void;
  colors: {
    tint: string;
    text: string;
  };
  cardBgColor: string;
}

export function ActionButtons({
  onPlay,
  onDownload,
  colors,
  cardBgColor,
}: ActionButtonsProps) {
  const theme = useColorScheme();
  const textColor = theme === "dark" ? "#000000" : "#FFFFFF";

  return (
    <View style={styles.actionButtons}>
      <Pressable
        style={[styles.playButton, { backgroundColor: colors.tint }]}
        onPress={() => onPlay()}
      >
        <IconSymbol size={24} name="play.fill" color={textColor} />
        <ThemedText style={[styles.playButtonText, { color: textColor }]}>
          Play Now
        </ThemedText>
      </Pressable>
      <Pressable
        style={[styles.downloadButton, { backgroundColor: colors.tint }]}
        onPress={onDownload}
      >
        <Ionicons size={24} name="download-outline" color={textColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  playButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  downloadButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
