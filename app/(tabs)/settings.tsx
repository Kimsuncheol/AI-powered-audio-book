import { AudioQualityModal } from "@/components/settings/AudioQualityModal";
import { CarModeModal } from "@/components/settings/CarModeModal";
import { DownloadSettingsModal } from "@/components/settings/DownloadSettingsModal";
import { NotificationsModal } from "@/components/settings/NotificationsModal";
import { PlaybackSettingsModal } from "@/components/settings/PlaybackSettingsModal";
import { GuestView } from "@/components/settings/views/GuestView";
import { SettingsMenuItem } from "@/components/settings/views/SettingsMenuItem";
import { SignOutButton } from "@/components/settings/views/SignOutButton";
import { UserInfoHeader } from "@/components/settings/views/UserInfoHeader";
import { UserStats } from "@/components/settings/views/UserStats";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useAuth } from "@/context/auth-context";
import { useSettings } from "@/context/settings-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
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
    return <GuestView colors={colors} cardBgColor={cardBgColor} />;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <UserInfoHeader user={user} colors={colors} />

          <UserStats cardBgColor={cardBgColor} />

          {/* Account Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>

            <SettingsMenuItem
              icon="person.fill"
              label="Edit Profile"
              onPress={() => router.push("/(tabs)/profile")}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingsMenuItem
              icon="bell.fill"
              label="Notifications"
              onPress={() => setShowNotificationsModal(true)}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingsMenuItem
              icon="lock.fill"
              label="Privacy & Security"
              onPress={() => router.push("/(tabs)/privacy-security")}
              colors={colors}
              cardBgColor={cardBgColor}
            />
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

            <SettingsMenuItem
              icon="speaker.wave.2.fill"
              label="Audio Quality"
              onPress={() => setShowAudioQualityModal(true)}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingsMenuItem
              icon="arrow.down.circle.fill"
              label="Download Settings"
              onPress={() => setShowDownloadSettingsModal(true)}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingsMenuItem
              icon="car.fill"
              label="Car Mode"
              onPress={() => setShowCarModeModal(true)}
              colors={colors}
              cardBgColor={cardBgColor}
            />

            <SettingsMenuItem
              icon="play.circle.fill"
              label="Playback Settings"
              onPress={() => setShowPlaybackSettings(true)}
              colors={colors}
              cardBgColor={cardBgColor}
            />
          </View>

          {/* Sign Out Section */}
          <View style={styles.section}>
            <SignOutButton onPress={handleSignOut} />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },
});
