import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { DownloadSettings } from "@/context/settings-context";
import { Modal, Pressable, StyleSheet, Switch, View } from "react-native";

interface DownloadSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  downloadSettings: DownloadSettings;
  onUpdateSettings: (settings: DownloadSettings) => void;
  colors: {
    tint: string;
    text: string;
    background: string;
    icon: string;
  };
  cardBgColor: string;
}

export function DownloadSettingsModal({
  visible,
  onClose,
  downloadSettings,
  onUpdateSettings,
  colors,
  cardBgColor,
}: DownloadSettingsModalProps) {
  const handleQualityChange = (quality: "standard" | "high") => {
    onUpdateSettings({ ...downloadSettings, downloadQuality: quality });
  };

  const handleWiFiOnlyToggle = (value: boolean) => {
    onUpdateSettings({ ...downloadSettings, downloadOnWiFiOnly: value });
  };

  const handleAutoDownloadToggle = (value: boolean) => {
    onUpdateSettings({ ...downloadSettings, autoDownload: value });
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
              Download Settings
            </ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol size={24} name="xmark" color={colors.icon} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Download Quality</ThemedText>
            <View style={styles.qualityOptions}>
              <Pressable
                style={[
                  styles.qualityOption,
                  { backgroundColor: cardBgColor },
                  downloadSettings.downloadQuality === "standard" && {
                    borderColor: colors.tint,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleQualityChange("standard")}
              >
                <View>
                  <ThemedText style={styles.qualityLabel}>Standard</ThemedText>
                  <ThemedText style={[styles.qualityDescription]}>
                    Smaller file size, good quality
                  </ThemedText>
                </View>
                {downloadSettings.downloadQuality === "standard" && (
                  <IconSymbol
                    size={24}
                    name="checkmark.circle.fill"
                    color={colors.tint}
                  />
                )}
              </Pressable>

              <Pressable
                style={[
                  styles.qualityOption,
                  { backgroundColor: cardBgColor },
                  downloadSettings.downloadQuality === "high" && {
                    borderColor: colors.tint,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleQualityChange("high")}
              >
                <View>
                  <ThemedText style={styles.qualityLabel}>High</ThemedText>
                  <ThemedText style={[styles.qualityDescription]}>
                    Larger file size, best quality
                  </ThemedText>
                </View>
                {downloadSettings.downloadQuality === "high" && (
                  <IconSymbol
                    size={24}
                    name="checkmark.circle.fill"
                    color={colors.tint}
                  />
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

            <View
              style={[styles.settingItem, { backgroundColor: cardBgColor }]}
            >
              <View style={styles.settingLeft}>
                <IconSymbol size={24} name="wifi" color={colors.icon} />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingLabel}>
                    WiFi Only Downloads
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Only download when connected to WiFi
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={downloadSettings.downloadOnWiFiOnly}
                onValueChange={handleWiFiOnlyToggle}
                trackColor={{ false: "#767577", true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View
              style={[styles.settingItem, { backgroundColor: cardBgColor }]}
            >
              <View style={styles.settingLeft}>
                <IconSymbol
                  size={24}
                  name="arrow.down.circle"
                  color={colors.icon}
                />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingLabel}>
                    Auto Download
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Automatically download new chapters
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={downloadSettings.autoDownload}
                onValueChange={handleAutoDownloadToggle}
                trackColor={{ false: "#767577", true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  qualityOptions: {
    gap: 12,
  },
  qualityOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  qualityDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
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
