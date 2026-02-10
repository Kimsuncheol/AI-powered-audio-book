import { ThemedText } from "@/components/themed-text";
import { AutoPlaySettings } from "@/context/settings-context";
import { Modal, StyleSheet, View } from "react-native";
import { AutoPlaySettingsSection } from "./AutoPlaySettingsSection";
import { SpeedSelector } from "./SpeedSelector";
import { DoneButton } from "./common/DoneButton";
import { ModalHeader } from "./common/ModalHeader";

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
            <SpeedSelector
              currentRate={currentRate}
              onRateChange={onRateChange}
              colors={colors}
              cardBgColor={cardBgColor}
            />
          </View>

          {/* Auto-Play Settings Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Auto-Play</ThemedText>
            <AutoPlaySettingsSection
              autoPlay={autoPlay}
              onAutoPlayChange={onAutoPlayChange}
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
});
