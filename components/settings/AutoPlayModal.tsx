import { ThemedText } from "@/components/themed-text";
import { AutoPlaySettings } from "@/context/settings-context";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ModalHeader } from "./common/ModalHeader";
import { SettingToggleItem } from "./common/SettingToggleItem";

interface AutoPlayModalProps {
  visible: boolean;
  onClose: () => void;
  autoPlay: AutoPlaySettings;
  onUpdateAutoPlay: (autoPlay: AutoPlaySettings) => void;
  colors: {
    tint: string;
    text: string;
    background: string;
    icon: string;
  };
  cardBgColor: string;
}

export function AutoPlayModal({
  visible,
  onClose,
  autoPlay,
  onUpdateAutoPlay,
  colors,
  cardBgColor,
}: AutoPlayModalProps) {
  const handleToggle = (key: keyof AutoPlaySettings) => {
    onUpdateAutoPlay({
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
            title="Auto-Play Settings"
            onClose={onClose}
            colors={colors}
          />

          <ThemedText style={[styles.description, { opacity: 0.7 }]}>
            Customize when and how audiobooks automatically start playing.
          </ThemedText>

          <View style={styles.settingsContainer}>
            <SettingToggleItem
              icon="play.circle.fill"
              label="Auto-Play Next Chapter"
              description="Automatically play next chapter when current ends"
              value={autoPlay.autoPlayNextChapter}
              onValueChange={() => handleToggle("autoPlayNextChapter")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="bluetooth"
              label="Auto-Play on Bluetooth"
              description="Start playback when Bluetooth device connects"
              value={autoPlay.autoPlayOnBluetooth}
              onValueChange={() => handleToggle("autoPlayOnBluetooth")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="headphones"
              label="Auto-Play on Headphones"
              description="Start playback when headphones are plugged in"
              value={autoPlay.autoPlayOnHeadphones}
              onValueChange={() => handleToggle("autoPlayOnHeadphones")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="arrow.clockwise"
              label="Auto-Resume on Return"
              description="Continue playback when returning to app"
              value={autoPlay.autoResumeOnReturn}
              onValueChange={() => handleToggle("autoResumeOnReturn")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="forward.end.fill"
              label="Continue Across Books"
              description="Auto-play next book in queue when finished"
              value={autoPlay.continueAcrossBooks}
              onValueChange={() => handleToggle("continueAcrossBooks")}
              colors={colors}
              cardBgColor={cardBgColor}
            />
          </View>

          <Pressable
            style={[styles.doneButton, { backgroundColor: colors.tint }]}
            onPress={onClose}
          >
            <ThemedText style={styles.doneButtonText}>Done</ThemedText>
          </Pressable>
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
    minHeight: 500,
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  settingsContainer: {
    gap: 12,
    marginBottom: 24,
  },
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
