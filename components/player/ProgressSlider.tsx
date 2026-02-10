import { ThemedText } from "@/components/themed-text";
import { formatTime } from "@/data/mock-audiobooks";
import Slider from "@react-native-community/slider";
import { StyleSheet, View } from "react-native";

interface ProgressSliderProps {
  position: number;
  duration: number;
  onSeek: (value: number) => void;
  colors: {
    tint: string;
  };
  colorScheme: "light" | "dark";
}

export function ProgressSlider({
  position,
  duration,
  onSeek,
  colors,
  colorScheme,
}: ProgressSliderProps) {
  return (
    <View style={styles.progressContainer}>
      <Slider
        style={styles.slider}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        minimumTrackTintColor={colors.tint}
        maximumTrackTintColor={colorScheme === "dark" ? "#444" : "#DDD"}
        thumbTintColor={colors.tint}
        onSlidingComplete={onSeek}
      />
      <View style={styles.timeContainer}>
        <ThemedText style={styles.timeText}>
          {formatTime(Math.floor(position / 1000))}
        </ThemedText>
        <ThemedText style={styles.timeText}>
          {formatTime(Math.floor(duration / 1000))}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  timeText: {
    fontSize: 13,
    opacity: 0.6,
  },
});
