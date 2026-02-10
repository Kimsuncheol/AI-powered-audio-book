import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AudioQuality } from "@/context/settings-context";
import { Modal, Pressable, StyleSheet, View } from "react-native";

interface AudioQualityModalProps {
  visible: boolean;
  onClose: () => void;
  selectedQuality: AudioQuality;
  onSelectQuality: (quality: AudioQuality) => void;
  colors: {
    tint: string;
    text: string;
    background: string;
    icon: string;
  };
  cardBgColor: string;
}

interface QualityOption {
  value: AudioQuality;
  label: string;
  description: string;
  bitrate: string;
}

const qualityOptions: QualityOption[] = [
  {
    value: "low",
    label: "Low",
    description: "Saves data, suitable for slow connections",
    bitrate: "64 kbps",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced quality and data usage",
    bitrate: "96 kbps",
  },
  {
    value: "high",
    label: "High",
    description: "Great quality for most listening",
    bitrate: "128 kbps",
  },
  {
    value: "ultra",
    label: "Ultra",
    description: "Best quality, requires more data",
    bitrate: "256 kbps",
  },
];

export function AudioQualityModal({
  visible,
  onClose,
  selectedQuality,
  onSelectQuality,
  colors,
  cardBgColor,
}: AudioQualityModalProps) {
  const handleSelect = (quality: AudioQuality) => {
    onSelectQuality(quality);
    setTimeout(onClose, 300);
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
          <View style={styles.modalHeader}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Audio Quality
            </ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol size={24} name="xmark" color={colors.icon} />
            </Pressable>
          </View>

          <ThemedText style={[styles.description, { opacity: 0.7 }]}>
            Choose the audio streaming quality. Higher quality uses more data.
          </ThemedText>

          <View style={styles.optionsContainer}>
            {qualityOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.optionItem,
                  { backgroundColor: cardBgColor },
                  selectedQuality === option.value && {
                    borderColor: colors.tint,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <View style={styles.optionLeft}>
                  <View>
                    <ThemedText style={styles.optionLabel}>
                      {option.label}
                    </ThemedText>
                    <ThemedText style={[styles.optionDescription]}>
                      {option.description}
                    </ThemedText>
                    <ThemedText
                      style={[styles.optionBitrate, { color: colors.tint }]}
                    >
                      {option.bitrate}
                    </ThemedText>
                  </View>
                </View>
                {selectedQuality === option.value && (
                  <IconSymbol
                    size={24}
                    name="checkmark.circle.fill"
                    color={colors.tint}
                  />
                )}
              </Pressable>
            ))}
          </View>
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
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  optionBitrate: {
    fontSize: 12,
    fontWeight: "600",
  },
});
