import { ThemedText } from "@/components/themed-text";
import { AutoPlaySettings } from "@/context/settings-context";
import { PLAYBACK_RATES } from "@/types/playback";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { DoneButton } from "./common/DoneButton";
import { ModalHeader } from "./common/ModalHeader";
import { SettingToggleItem } from "./common/SettingToggleItem";

interface PlaybackSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  currentRate: number;
  onRateChange: (rate: number) => void;
  autoPlay: AutoPlaySettings;
  onAutoPlayChange: (autoPlay: AutoPlaySettings) => void;
  colors: {
    tint: string;
    text: string;
    background: string;
    icon: string;
  };
  cardBgColor: string;
}

export function PlaybackSettingsModal({
  visible,
  onClose,
  currentRate,
  onRateChange,
  autoPlay,
  onAutoPlayChange,
  colors,
  cardBgColor,
}: PlaybackSettingsModalProps) {
  const handleAutoPlayToggle = (key: keyof AutoPlaySettings) => {
    onAutoPlayChange({
      ...autoPlay,
      [key]: !autoPlay[key],
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <ModalHeader
            title="Playback Settings"
            onClose={onClose}
            colors={colors}
          />

          {/* Playback Speed Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Playback Speed</ThemedText>
            <View style={styles.speedGrid}>
              {PLAYBACK_RATES.map((rate) => (
                <Pressable
                  key={rate}
                  style={[
                    styles.speedButton,
                    { backgroundColor: cardBgColor },
                    currentRate === rate && {
                      backgroundColor: colors.tint,
                    },
                  ]}
                  onPress={() => onRateChange(rate)}
                >
                  <ThemedText
                    style={[
                      styles.speedButtonText,
                      currentRate === rate && styles.speedButtonTextActive,
                    ]}
                  >
                    {rate}x
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Auto-Play Settings Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Auto-Play</ThemedText>

            <SettingToggleItem
              icon="play.circle.fill"
              label="Auto-Play Next Chapter"
              description="Automatically play next chapter when current ends"
              value={autoPlay.autoPlayNextChapter}
              onValueChange={() => handleAutoPlayToggle("autoPlayNextChapter")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="bluetooth"
              label="Auto-Play on Bluetooth"
              description="Start playback when Bluetooth device connects"
              value={autoPlay.autoPlayOnBluetooth}
              onValueChange={() => handleAutoPlayToggle("autoPlayOnBluetooth")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="headphones"
              label="Auto-Play on Headphones"
              description="Start playback when headphones are plugged in"
              value={autoPlay.autoPlayOnHeadphones}
              onValueChange={() =>
                handleAutoPlayToggle("autoPlayOnHeadphones")
              }
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="arrow.clockwise"
              label="Auto-Resume on Return"
              description="Continue playback when returning to app"
              value={autoPlay.autoResumeOnReturn}
              onValueChange={() => handleAutoPlayToggle("autoResumeOnReturn")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="forward.end.fill"
              label="Continue Across Books"
              description="Auto-play next book in queue when finished"
              value={autoPlay.continueAcrossBooks}
              onValueChange={() => handleAutoPlayToggle("continueAcrossBooks")}
              colors={colors}
              cardBgColor={cardBgColor}
            />
          </View>

          <DoneButton onPress={onClose} colors={colors} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  speedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  speedButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  speedButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  speedButtonTextActive: {
    color: "#FFFFFF",
  },
});
