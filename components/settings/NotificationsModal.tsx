import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { NotificationSettings } from "@/context/settings-context";
import { Modal, Pressable, StyleSheet, Switch, View } from "react-native";

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
          <View style={styles.modalHeader}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Notifications
            </ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol size={24} name="xmark" color={colors.icon} />
            </Pressable>
          </View>

          <ThemedText style={[styles.description, { opacity: 0.7 }]}>
            Manage your notification preferences for the app.
          </ThemedText>

          <View style={styles.settingsContainer}>
            <View
              style={[styles.settingItem, { backgroundColor: cardBgColor }]}
            >
              <View style={styles.settingLeft}>
                <IconSymbol size={24} name="book.fill" color={colors.icon} />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingLabel}>
                    New Releases
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Notify me when new audiobooks are released
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={notifications.newReleases}
                onValueChange={() => handleToggle("newReleases")}
                trackColor={{ false: "#767577", true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View
              style={[styles.settingItem, { backgroundColor: cardBgColor }]}
            >
              <View style={styles.settingLeft}>
                <IconSymbol size={24} name="sparkles" color={colors.icon} />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingLabel}>
                    Recommendations
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Get personalized book recommendations
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={notifications.recommendations}
                onValueChange={() => handleToggle("recommendations")}
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
                  name="arrow.down.circle.fill"
                  color={colors.icon}
                />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingLabel}>
                    App Updates
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Notifications about new features and updates
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={notifications.updates}
                onValueChange={() => handleToggle("updates")}
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
                  name="megaphone.fill"
                  color={colors.icon}
                />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingLabel}>
                    Marketing & Offers
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Special offers and promotional content
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={notifications.marketing}
                onValueChange={() => handleToggle("marketing")}
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
  settingsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
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
