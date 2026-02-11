import { ThemedText } from "@/components/themed-text";
import { NotificationSettings } from "@/context/settings-context";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ModalHeader } from "./common/ModalHeader";
import { SettingToggleItem } from "./common/SettingToggleItem";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: NotificationSettings;
  onUpdateNotifications: (notifications: NotificationSettings) => void;
  colors: {
    tint: string;
    text: string;
    background: string;
    icon: string;
  };
  cardBgColor: string;
}

export function NotificationsModal({
  visible,
  onClose,
  notifications,
  onUpdateNotifications,
  colors,
  cardBgColor,
}: NotificationsModalProps) {
  const tintButtonTextColor =
    colors.tint.toLowerCase() === "#fff" || colors.tint.toLowerCase() === "#ffffff"
      ? "#000000"
      : "#FFFFFF";

  const handleToggle = (key: keyof NotificationSettings) => {
    onUpdateNotifications({
      ...notifications,
      [key]: !notifications[key],
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
            title="Notifications"
            onClose={onClose}
            colors={colors}
          />

          <ThemedText style={[styles.description, { opacity: 0.7 }]}>
            Manage your notification preferences for the app.
          </ThemedText>

          <View style={styles.settingsContainer}>
            <SettingToggleItem
              icon="book.fill"
              label="New Releases"
              description="Notify me when new audiobooks are released"
              value={notifications.newReleases}
              onValueChange={() => handleToggle("newReleases")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="sparkles"
              label="Recommendations"
              description="Get personalized book recommendations"
              value={notifications.recommendations}
              onValueChange={() => handleToggle("recommendations")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="arrow.down.circle.fill"
              label="App Updates"
              description="Notifications about new features and updates"
              value={notifications.updates}
              onValueChange={() => handleToggle("updates")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingToggleItem
              icon="megaphone.fill"
              label="Marketing & Offers"
              description="Special offers and promotional content"
              value={notifications.marketing}
              onValueChange={() => handleToggle("marketing")}
              colors={colors}
              cardBgColor={cardBgColor}
            />
          </View>

          <Pressable
            style={[styles.doneButton, { backgroundColor: colors.tint }]}
            onPress={onClose}
          >
            <ThemedText style={[styles.doneButtonText, { color: tintButtonTextColor }]}>
              Done
            </ThemedText>
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
    fontSize: 16,
    fontWeight: "600",
  },
});
