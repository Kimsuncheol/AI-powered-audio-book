import { ThemedText } from "@/components/themed-text";
import { CarModeSettings } from "@/context/settings-context";
import { Modal, StyleSheet, View } from "react-native";
import { DoneButton } from "./common/DoneButton";
import { ModalHeader } from "./common/ModalHeader";
import { SettingToggleItem } from "./common/SettingToggleItem";

interface CarModeModalProps {
  visible: boolean;
  onClose: () => void;
  carMode: CarModeSettings;
  onUpdateCarMode: (carMode: CarModeSettings) => void;
  colors: {
    tint: string;
    text: string;
    background: string;
    icon: string;
  };
  cardBgColor: string;
}

export function CarModeModal({
  visible,
  onClose,
  carMode,
  onUpdateCarMode,
  colors,
  cardBgColor,
}: CarModeModalProps) {
  const handleToggle = (key: keyof CarModeSettings) => {
    onUpdateCarMode({
      ...carMode,
      [key]: !carMode[key],
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
          <ModalHeader title="Car Mode" onClose={onClose} colors={colors} />

          <ThemedText style={[styles.description, { opacity: 0.7 }]}>
            Optimize your listening experience for driving with larger controls
            and simplified interface.
          </ThemedText>

          <View style={styles.settingsContainer}>
            <SettingToggleItem
              icon="car.fill"
              label="Enable Car Mode"
              description="Activate car mode for driving"
              value={carMode.enabled}
              onValueChange={() => handleToggle("enabled")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="bluetooth"
              label="Auto-Launch on Bluetooth"
              description="Start car mode when connected to car Bluetooth"
              value={carMode.autoLaunchOnBluetooth}
              onValueChange={() => handleToggle("autoLaunchOnBluetooth")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="sun.max.fill"
              label="Keep Screen On"
              description="Prevent screen from sleeping during playback"
              value={carMode.keepScreenOn}
              onValueChange={() => handleToggle("keepScreenOn")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="light.max"
              label="Increased Brightness"
              description="Boost screen brightness for better visibility"
              value={carMode.increasedBrightness}
              onValueChange={() => handleToggle("increasedBrightness")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="hand.tap.fill"
              label="Simplified Controls"
              description="Show larger buttons for easier access"
              value={carMode.simplifiedControls}
              onValueChange={() => handleToggle("simplifiedControls")}
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
});
