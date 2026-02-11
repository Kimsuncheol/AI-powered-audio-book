import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacySecurityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user } = useAuth();

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showListeningActivity: true,
    allowRecommendations: true,
  });

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const tintButtonTextColor = colorScheme === "dark" ? "#000000" : "#FFFFFF";

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // TODO: Implement password change with Firebase
    Alert.alert(
      "Success",
      "Password changed successfully",
      [
        {
          text: "OK",
          onPress: () => {
            setShowChangePasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert("Account Deleted", "Your account has been deleted");
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol size={24} name="chevron.left" color={colors.icon} />
          </Pressable>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Privacy & Security
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Account Security Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Account Security
            </ThemedText>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => setShowChangePasswordModal(true)}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol size={24} name="key.fill" color={colors.icon} />
                <ThemedText style={styles.menuItemText}>
                  Change Password
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() =>
                Alert.alert("Coming Soon", "Two-factor authentication is coming soon!")
              }
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="shield.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>
                  Two-Factor Authentication
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>
          </View>

          {/* Privacy Settings Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Privacy Settings
            </ThemedText>

            <View
              style={[styles.settingItem, { backgroundColor: cardBgColor }]}
            >
              <View style={styles.settingLeft}>
                <IconSymbol size={24} name="eye.fill" color={colors.icon} />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingLabel}>
                    Profile Visibility
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Make your profile visible to others
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={privacySettings.profileVisibility}
                onValueChange={(value) =>
                  setPrivacySettings({ ...privacySettings, profileVisibility: value })
                }
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
                  name="chart.bar.fill"
                  color={colors.icon}
                />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingLabel}>
                    Listening Activity
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Show your listening activity to followers
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={privacySettings.showListeningActivity}
                onValueChange={(value) =>
                  setPrivacySettings({
                    ...privacySettings,
                    showListeningActivity: value,
                  })
                }
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
                    Personalized Recommendations
                  </ThemedText>
                  <ThemedText style={[styles.settingDescription]}>
                    Allow us to use your data for recommendations
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={privacySettings.allowRecommendations}
                onValueChange={(value) =>
                  setPrivacySettings({
                    ...privacySettings,
                    allowRecommendations: value,
                  })
                }
                trackColor={{ false: "#767577", true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Data & Storage Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Data & Storage</ThemedText>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() =>
                Alert.alert("Coming Soon", "Data download is coming soon!")
              }
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="arrow.down.doc.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>
                  Download My Data
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() =>
                Alert.alert(
                  "Clear Cache",
                  "This will clear all cached data. Are you sure?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Clear",
                      onPress: () =>
                        Alert.alert("Success", "Cache cleared successfully"),
                    },
                  ]
                )
              }
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="trash.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>Clear Cache</ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>
          </View>

          {/* Danger Zone Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Danger Zone</ThemedText>

            <Pressable
              style={[styles.menuItem, styles.dangerButton]}
              onPress={handleDeleteAccount}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="exclamationmark.triangle.fill"
                  color="#FF3B30"
                />
                <ThemedText style={[styles.menuItemText, styles.dangerText]}>
                  Delete Account
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePasswordModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.background }]}
          >
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Change Password
              </ThemedText>
              <Pressable onPress={() => setShowChangePasswordModal(false)}>
                <IconSymbol size={24} name="xmark" color={colors.icon} />
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Current Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: cardBgColor, color: colors.text },
                ]}
                placeholder="Enter current password"
                placeholderTextColor={colors.icon}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>New Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: cardBgColor, color: colors.text },
                ]}
                placeholder="Enter new password"
                placeholderTextColor={colors.icon}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>
                Confirm New Password
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: cardBgColor, color: colors.text },
                ]}
                placeholder="Confirm new password"
                placeholderTextColor={colors.icon}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.cancelButton, { backgroundColor: cardBgColor }]}
                onPress={() => setShowChangePasswordModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.submitButton, { backgroundColor: colors.tint }]}
                onPress={handleChangePassword}
              >
                <ThemedText style={[styles.submitButtonText, { color: tintButtonTextColor }]}>
                  Change Password
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
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
  dangerButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  dangerText: {
    color: "#FF3B30",
  },
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
