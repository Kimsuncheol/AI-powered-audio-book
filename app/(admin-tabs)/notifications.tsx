import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Email Notifications
  const [emailNewUsers, setEmailNewUsers] = useState(true);
  const [emailNewContent, setEmailNewContent] = useState(true);
  const [emailReports, setEmailReports] = useState(true);
  const [emailSystemAlerts, setEmailSystemAlerts] = useState(true);

  // Push Notifications
  const [pushNewUsers, setPushNewUsers] = useState(false);
  const [pushNewContent, setPushNewContent] = useState(true);
  const [pushReports, setPushReports] = useState(true);
  const [pushSystemAlerts, setPushSystemAlerts] = useState(true);

  // Notification Settings
  const [enableDailyDigest, setEnableDailyDigest] = useState(true);
  const [enableWeeklyReport, setEnableWeeklyReport] = useState(true);

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const cardBorderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";

  const handleSave = () => {
    Alert.alert("Success", "Notification preferences saved successfully");
  };

  const SettingRow = ({
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E5EA", true: colors.tint }}
      />
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
            Notifications
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Email Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol size={24} name="envelope.fill" color={colors.tint} />
              <ThemedText style={styles.sectionTitle}>
                Email Notifications
              </ThemedText>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <SettingRow
                title="New User Registrations"
                subtitle="Get notified when new users sign up"
                value={emailNewUsers}
                onValueChange={setEmailNewUsers}
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="New Content Submissions"
                subtitle="Notify when authors upload new audiobooks"
                value={emailNewContent}
                onValueChange={setEmailNewContent}
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="User Reports"
                subtitle="Receive alerts about reported content"
                value={emailReports}
                onValueChange={setEmailReports}
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="System Alerts"
                subtitle="Critical platform issues and errors"
                value={emailSystemAlerts}
                onValueChange={setEmailSystemAlerts}
              />
            </View>
          </View>

          {/* Push Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol size={24} name="bell.fill" color={colors.tint} />
              <ThemedText style={styles.sectionTitle}>
                Push Notifications
              </ThemedText>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <SettingRow
                title="New User Registrations"
                subtitle="Push alerts for new user sign-ups"
                value={pushNewUsers}
                onValueChange={setPushNewUsers}
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="New Content Submissions"
                subtitle="Instant push for pending content review"
                value={pushNewContent}
                onValueChange={setPushNewContent}
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="User Reports"
                subtitle="Immediate alerts for reported issues"
                value={pushReports}
                onValueChange={setPushReports}
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="System Alerts"
                subtitle="Critical alerts requiring immediate action"
                value={pushSystemAlerts}
                onValueChange={setPushSystemAlerts}
              />
            </View>
          </View>

          {/* Digest & Reports */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol
                size={24}
                name="calendar.badge.clock"
                color={colors.tint}
              />
              <ThemedText style={styles.sectionTitle}>
                Digest & Reports
              </ThemedText>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <SettingRow
                title="Daily Digest"
                subtitle="Summary of platform activity sent daily at 9 AM"
                value={enableDailyDigest}
                onValueChange={setEnableDailyDigest}
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="Weekly Report"
                subtitle="Comprehensive analytics sent every Monday"
                value={enableWeeklyReport}
                onValueChange={setEnableWeeklyReport}
              />
            </View>
          </View>

          {/* Notification Preferences */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol size={24} name="slider.horizontal.3" color={colors.tint} />
              <ThemedText style={styles.sectionTitle}>
                Preferences
              </ThemedText>
            </View>
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
                    "Quiet Hours",
                    "Set hours when notifications are silenced"
                  )
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Quiet Hours
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    10 PM - 8 AM
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
                  Alert.alert(
                    "Notification Sound",
                    "Choose notification sound preference"
                  )
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Notification Sound
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>Default</ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color={colors.icon} />
              </Pressable>
            </View>
          </View>

          {/* Test Notifications */}
          <View style={styles.section}>
            <Pressable
              style={[
                styles.testButton,
                {
                  backgroundColor: cardBgColor,
                  borderColor: cardBorderColor,
                },
              ]}
              onPress={() =>
                Alert.alert(
                  "Test Notification",
                  "A test notification has been sent to your device"
                )
              }
            >
              <IconSymbol size={24} name="paperplane.fill" color={colors.tint} />
              <ThemedText style={styles.testButtonText}>
                Send Test Notification
              </ThemedText>
            </Pressable>
          </View>

          {/* Save Button */}
          <Pressable
            style={[styles.saveButton, { backgroundColor: colors.tint }]}
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>
              Save Preferences
            </ThemedText>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
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
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
