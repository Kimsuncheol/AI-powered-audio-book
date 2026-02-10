import { AudioQualityModal } from "@/components/settings/AudioQualityModal";
import { CarModeModal } from "@/components/settings/CarModeModal";
import { DownloadSettingsModal } from "@/components/settings/DownloadSettingsModal";
import { NotificationsModal } from "@/components/settings/NotificationsModal";
import { PlaybackSettingsModal } from "@/components/settings/PlaybackSettingsModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useAuth } from "@/context/auth-context";
import { useSettings } from "@/context/settings-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, isGuest, signOut } = useAuth();
  const { playbackState, setPlaybackRate } = useAudioPlayer();
  const {
    settings,
    updateAudioQuality,
    updateNotifications,
    updateDownloadSettings,
    updateCarMode,
    updateAutoPlay,
  } = useSettings();

  const [showAudioQualityModal, setShowAudioQualityModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showDownloadSettingsModal, setShowDownloadSettingsModal] =
    useState(false);
  const [showCarModeModal, setShowCarModeModal] = useState(false);
  const [showPlaybackSettings, setShowPlaybackSettings] = useState(false);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/");
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to sign out");
          }
        },
      },
    ]);
  };

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  // Guest Mode UI
  if (isGuest) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: colors.icon + "40" },
                ]}
              >
                <IconSymbol size={50} name="person.fill" color={colors.icon} />
              </View>
              <ThemedText type="title" style={styles.name}>
                Guest User
              </ThemedText>
              <ThemedText style={styles.email}>
                Browsing in preview mode
              </ThemedText>
            </View>

            <View
              style={[
                styles.guestBanner,
                {
                  backgroundColor: colors.tint + "20",
                  borderColor: colors.tint,
                },
              ]}
            >
              <IconSymbol
                size={24}
                name="info.circle.fill"
                color={colors.tint}
              />
              <View style={styles.guestBannerText}>
                <ThemedText
                  style={[styles.guestBannerTitle, { color: colors.tint }]}
                >
                  Create an Account
                </ThemedText>
                <ThemedText style={styles.guestBannerSubtitle}>
                  Unlock all features and sync your progress across devices
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Features Requiring Sign Up
              </ThemedText>

              <View
                style={[styles.featureItem, { backgroundColor: cardBgColor }]}
              >
                <IconSymbol size={24} name="heart.fill" color={colors.icon} />
                <ThemedText style={styles.featureText}>
                  Save favorite audiobooks
                </ThemedText>
              </View>

              <View
                style={[styles.featureItem, { backgroundColor: cardBgColor }]}
              >
                <IconSymbol
                  size={24}
                  name="chart.bar.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.featureText}>
                  Track listening progress
                </ThemedText>
              </View>

              <View
                style={[styles.featureItem, { backgroundColor: cardBgColor }]}
              >
                <IconSymbol
                  size={24}
                  name="play.circle.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.featureText}>
                  Unlimited playback access
                </ThemedText>
              </View>

              <View
                style={[styles.featureItem, { backgroundColor: cardBgColor }]}
              >
                <IconSymbol size={24} name="star.fill" color={colors.icon} />
                <ThemedText style={styles.featureText}>
                  Write and share reviews
                </ThemedText>
              </View>

              <View
                style={[styles.featureItem, { backgroundColor: cardBgColor }]}
              >
                <IconSymbol size={24} name="icloud.fill" color={colors.icon} />
                <ThemedText style={styles.featureText}>
                  Sync across all devices
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <Pressable
                style={[styles.loginButton, { borderColor: colors.tint }]}
                onPress={() => router.push("/(auth)/login")}
              >
                <ThemedText
                  style={[styles.loginButtonText, { color: colors.tint }]}
                >
                  Log In to Existing Account
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View
              style={[styles.avatarContainer, { backgroundColor: colors.tint }]}
            >
              <ThemedText style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || "U"}
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.name}>
              {user?.displayName || "User"}
            </ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: cardBgColor }]}>
              <ThemedText style={styles.statNumber}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Books</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBgColor }]}>
              <ThemedText style={styles.statNumber}>0h</ThemedText>
              <ThemedText style={styles.statLabel}>Listening Time</ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol size={24} name="person.fill" color={colors.icon} />
                <ThemedText style={styles.menuItemText}>
                  Edit Profile
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => setShowNotificationsModal(true)}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol size={24} name="bell.fill" color={colors.icon} />
                <ThemedText style={styles.menuItemText}>
                  Notifications
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(tabs)/privacy-security")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol size={24} name="lock.fill" color={colors.icon} />
                <ThemedText style={styles.menuItemText}>
                  Privacy & Security
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => setShowAudioQualityModal(true)}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="speaker.wave.2.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>
                  Audio Quality
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => setShowDownloadSettingsModal(true)}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="arrow.down.circle.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>
                  Download Settings
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => setShowCarModeModal(true)}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol size={24} name="car.fill" color={colors.icon} />
                <ThemedText style={styles.menuItemText}>Car Mode</ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => setShowPlaybackSettings(true)}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="play.circle.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>
                  Playback Settings
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Pressable
              style={[styles.menuItem, styles.signOutButton]}
              onPress={handleSignOut}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="rectangle.portrait.and.arrow.right"
                  color="#FF3B30"
                />
                <ThemedText style={[styles.menuItemText, styles.signOutText]}>
                  Sign Out
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modals */}
      <AudioQualityModal
        visible={showAudioQualityModal}
        onClose={() => setShowAudioQualityModal(false)}
        selectedQuality={settings.audioQuality}
        onSelectQuality={updateAudioQuality}
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <NotificationsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={settings.notifications}
        onUpdateNotifications={updateNotifications}
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <DownloadSettingsModal
        visible={showDownloadSettingsModal}
        onClose={() => setShowDownloadSettingsModal(false)}
        downloadSettings={settings.downloadSettings}
        onUpdateSettings={updateDownloadSettings}
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <CarModeModal
        visible={showCarModeModal}
        onClose={() => setShowCarModeModal(false)}
        carMode={settings.carMode}
        onUpdateCarMode={updateCarMode}
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <PlaybackSettingsModal
        visible={showPlaybackSettings}
        onClose={() => setShowPlaybackSettings(false)}
        currentRate={playbackState.playbackRate}
        onRateChange={setPlaybackRate}
        autoPlay={settings.autoPlay}
        onAutoPlayChange={updateAutoPlay}
        colors={colors}
        cardBgColor={cardBgColor}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 24,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
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
  signOutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  signOutText: {
    color: "#FF3B30",
  },
  guestBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  guestBannerText: {
    flex: 1,
  },
  guestBannerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  guestBannerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  createAccountButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  createAccountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  exitGuestButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#8E8E93",
  },
});
