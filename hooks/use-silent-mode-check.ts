import { Alert, Platform } from "react-native";

interface SilentModeCheckResult {
  isSilent: boolean;
  checkAndAlert: () => boolean;
}

// Check if the library is available
let VolumeManager: any = null;
try {
  VolumeManager = require("react-native-volume-manager");
} catch (error) {
  console.log("react-native-volume-manager not installed - silent mode check disabled");
}

export function useSilentModeCheck(): SilentModeCheckResult {
  // If library is not available, return fallback
  if (!VolumeManager) {
    return {
      isSilent: false,
      checkAndAlert: () => true, // Always allow playback
    };
  }

  // iOS: Check silent switch
  const { isMuted } = VolumeManager.useSilentSwitch();

  // Android: Check ringer mode
  const { mode } = VolumeManager.useRingerMode();

  const isSilent = Platform.select({
    ios: isMuted,
    android: mode === "silent" || mode === "vibrate",
    default: false,
  }) ?? false;

  const checkAndAlert = (): boolean => {
    if (isSilent) {
      const message = Platform.select({
        ios: "Your device is in silent mode. Please turn off silent mode to hear audio.",
        android: `Your device is in ${mode} mode. Please switch to normal mode to hear audio.`,
        default: "Your device may be in silent mode.",
      });

      Alert.alert(
        "Device is Muted",
        message,
        [
          {
            text: "Play Anyway",
            style: "default",
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {}, // User cancelled
          },
        ],
      );
      return false; // Indicates user was warned
    }
    return true; // OK to play
  };

  return { isSilent, checkAndAlert };
}
