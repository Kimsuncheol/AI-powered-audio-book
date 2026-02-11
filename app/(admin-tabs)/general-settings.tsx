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
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GeneralSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [appName, setAppName] = useState("AI Audiobook");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const cardBorderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";

  const handleSave = () => {
    Alert.alert("Success", "Settings saved successfully");
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
            General Settings
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* App Configuration */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              App Configuration
            </ThemedText>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>App Name</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: cardBgColor,
                      borderColor: cardBorderColor,
                      color: colors.text,
                    },
                  ]}
                  value={appName}
                  onChangeText={setAppName}
                  placeholder="Enter app name"
                  placeholderTextColor={colors.icon}
                />
              </View>
            </View>
          </View>

          {/* Platform Settings */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Platform Settings
            </ThemedText>
            <View
              style={[
                styles.card,
                { backgroundColor: cardBgColor, borderColor: cardBorderColor },
              ]}
            >
              <SettingRow
                title="Maintenance Mode"
                subtitle="Temporarily disable app for maintenance"
                rightComponent={
                  <Switch
                    value={maintenanceMode}
                    onValueChange={setMaintenanceMode}
                    trackColor={{ false: "#E5E5EA", true: colors.tint }}
                  />
                }
              />
              <View
                style={[styles.divider, { backgroundColor: cardBorderColor }]}
              />
              <SettingRow
                title="Auto-approve Content"
                subtitle="Automatically approve new audiobooks"
                rightComponent={
                  <Switch
                    value={autoApprove}
                    onValueChange={setAutoApprove}
                    trackColor={{ false: "#E5E5EA", true: colors.tint }}
                  />
                }
              />
            </View>
          </View>

          {/* Data & Storage */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Data & Storage
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
                    "Data Retention",
                    "Configure how long user data is stored"
                  )
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Data Retention Policy
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    90 days for inactive accounts
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
                    "Cache Management",
                    "Clear cached data to free up space"
                  )
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Clear Cache
                  </ThemedText>
                  <ThemedText style={styles.actionSubtitle}>
                    Free up storage space
                  </ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color={colors.icon} />
              </Pressable>
            </View>
          </View>

          {/* Legal & Policies */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Legal & Policies
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
                  Alert.alert("Terms of Service", "Edit terms of service")
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Terms of Service
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
                  Alert.alert("Privacy Policy", "Edit privacy policy")
                }
              >
                <View style={styles.actionInfo}>
                  <ThemedText style={styles.actionTitle}>
                    Privacy Policy
                  </ThemedText>
                </View>
                <IconSymbol size={20} name="chevron.right" color={colors.icon} />
              </Pressable>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={[styles.saveButton, { backgroundColor: colors.tint }]}
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
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
  inputContainer: {
    padding: 16,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
