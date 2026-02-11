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

export default function SecurityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user } = useAuth();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [requireStrongPassword, setRequireStrongPassword] = useState(true);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const cardBorderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";
  const modalBgColor = colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF";

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    // Here you would typically call a Firebase function to update password
    Alert.alert("Success", "Password changed successfully");
    setPasswordModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const SettingRow = ({
    title,
    subtitle,
    rightComponent,
  }: {
    title: string;
    subtitle?: string;
    rightComponent: React.ReactNode;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
        )}
      </View>
      {rightComponent}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol size={24} name="chevron.left" color={colors.text} />
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            Security
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Account Security */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Account Security
            </ThemedText>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <Pressable
                style={styles.actionRow}
                onPress={() => setPasswordModalVisible(true)}
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Change Password
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    Update your account password
                  </ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color={colors.icon} />
              </Pressable>
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="Two-Factor Authentication"
                subtitle="Add an extra layer of security"
                rightComponent={
                  <Switch
                    value={twoFactorEnabled}
                    onValueChange={(value) => {
                      if (value) {
                        Alert.alert(
                          "Enable 2FA",
                          "Two-factor authentication will be set up",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Continue",
                              onPress: () => setTwoFactorEnabled(true),
                            },
                          ]
                        );
                      } else {
                        setTwoFactorEnabled(false);
                      }
                    }}
                    trackColor={{ false: "#E5E5EA", true: colors.tint }}
                  />
                }
              />
            </View>
          </View>

          {/* Password Policies */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Password Policies
            </ThemedText>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <SettingRow
                title="Require Strong Passwords"
                subtitle="Enforce minimum 8 characters with special chars"
                rightComponent={
                  <Switch
                    value={requireStrongPassword}
                    onValueChange={setRequireStrongPassword}
                    trackColor={{ false: "#E5E5EA", true: colors.tint }}
                  />
                }
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <Pressable
                style={styles.actionRow}
                onPress={() =>
                  Alert.alert(
                    "Password Expiry",
                    "Set password expiration period: 90 days"
                  )
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Password Expiry
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    90 days (recommended)
                  </ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color={colors.icon} />
              </Pressable>
            </View>
          </View>

          {/* Session Management */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Session Management
            </ThemedText>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <Pressable
                style={styles.actionRow}
                onPress={() =>
                  Alert.alert(
                    "Session Timeout",
                    "Configure automatic logout after inactivity"
                  )
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Session Timeout
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    30 minutes of inactivity
                  </ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color={colors.icon} />
              </Pressable>
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <Pressable
                style={styles.actionRow}
                onPress={() =>
                  Alert.alert("Active Sessions", "View and manage active sessions")
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Active Sessions
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    View login activity
                  </ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color={colors.icon} />
              </Pressable>
            </View>
          </View>

          {/* API Access */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>API Access</ThemedText>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <Pressable
                style={styles.actionRow}
                onPress={() =>
                  Alert.alert("API Keys", "Manage API access tokens")
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Manage API Keys
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    Create and revoke access tokens
                  </ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color={colors.icon} />
              </Pressable>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: "#FF3B30" }]}>
              Danger Zone
            </ThemedText>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: cardBgColor,
                  borderColor: "#FF3B30",
                  borderWidth: 1,
                },
              ]}
            >
              <Pressable
                style={styles.actionRow}
                onPress={() =>
                  Alert.alert(
                    "Force Logout All Users",
                    "This will log out all users from the platform. Are you sure?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Force Logout",
                        style: "destructive",
                        onPress: () =>
                          Alert.alert("Success", "All users have been logged out"),
                      },
                    ]
                  )
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={[styles.actionTitle, { color: "#FF3B30" }]}>
                    Force Logout All Users
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    End all active sessions
                  </ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color="#FF3B30" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <ThemedText style={styles.modalTitle}>Change Password</ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              Enter your current password and new password
            </ThemedText>

            <View style={styles.modalInputs}>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: cardBgColor,
                    borderColor: cardBorderColor,
                    color: colors.text,
                  },
                ]}
                placeholder="Current Password"
                placeholderTextColor={colors.icon}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: cardBgColor,
                    borderColor: cardBorderColor,
                    color: colors.text,
                  },
                ]}
                placeholder="New Password"
                placeholderTextColor={colors.icon}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: cardBgColor,
                    borderColor: cardBorderColor,
                    color: colors.text,
                  },
                ]}
                placeholder="Confirm New Password"
                placeholderTextColor={colors.icon}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: cardBgColor }]}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.tint }]}
                onPress={handleChangePassword}
              >
                <ThemedText style={{ color: "#FFFFFF" }}>
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
  },
  backButton: {
    width: 40,
  },
  title: {
    fontSize: 20,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
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
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  divider: {
    height: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  modalInputs: {
    gap: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
