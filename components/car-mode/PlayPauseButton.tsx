import { IconSymbol } from "@/components/ui/icon-symbol";
import { Pressable, StyleSheet, View } from "react-native";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  colors: {
    tint: string;
  };
}

export function PlayPauseButton({
  isPlaying,
  onToggle,
  colors,
}: PlayPauseButtonProps) {
  return (
    <View style={styles.playbackSection}>
      <Pressable
        onPress={onToggle}
        style={[styles.largePlayButton, { backgroundColor: colors.tint }]}
      >
        <IconSymbol
          size={80}
          name={isPlaying ? "pause.fill" : "play.fill"}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  playbackSection: {
    marginBottom: 40,
  },
  largePlayButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
