import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

interface SilentModeCheckResult {
  isSilent: boolean;
  checkAndAlert: (onProceed?: () => void) => void;
}

// Check if the library is available
let VolumeManager: any = null;
try {
  VolumeManager = require("react-native-volume-manager");
} catch (error) {
  console.log(
    "react-native-volume-manager not installed - silent mode check disabled",
  );
}

export function useSilentModeCheck(): SilentModeCheckResult {
  const [volume, setVolume] = useState<number>(1);

  // Get silent switch and ringer mode status
  // These will be default values if library is not available
  const silentSwitchResult = VolumeManager?.useSilentSwitch() ?? {
    isMuted: false,
  };
  const ringerModeResult = VolumeManager?.useRingerMode() ?? { mode: "normal" };

  const isMuted = silentSwitchResult.isMuted;
  const mode = ringerModeResult.mode;

  // Listen for volume changes
  useEffect(() => {
    if (!VolumeManager) {
      setVolume(1); // Assume volume is up if library not available
      return;
    }

    // Get initial volume
    VolumeManager.getVolume()
      .then((vol: number) => {
        setVolume(vol);
      })
      .catch(() => {
        setVolume(1); // Fallback to assuming volume is up
      });

    // Listen for volume changes
    const volumeListener = VolumeManager.addVolumeListener(
      (result: { volume: number }) => {
        setVolume(result.volume);
      },
    );

    return () => {
      if (volumeListener?.remove) {
        volumeListener.remove();
      }
    };
  }, []);

  // If library is not available, return fallback
  if (!VolumeManager) {
    return {
      isSilent: false,
      checkAndAlert: (onProceed?: () => void) => {
        // Library not available, always proceed
        onProceed?.();
      },
    };
  }

  // Check if device is in silent mode OR volume is 0
  const isVolumeMuted = volume === 0;
  const isSilentMode =
    Platform.select({
      ios: isMuted,
      android: mode === "silent" || mode === "vibrate",
      default: false,
    }) ?? false;

  const isSilent = isSilentMode || isVolumeMuted;

  const checkAndAlert = (onProceed?: () => void): void => {
    if (isSilent) {
      let message = "";

      if (isVolumeMuted && isSilentMode) {
        message =
          Platform.select({
            ios: "Your device is in silent mode and volume is at 0%. Please turn off silent mode and increase volume to hear audio.",
            android: `Your device is in ${mode} mode and volume is at 0%. Please switch to normal mode and increase volume to hear audio.`,
            default: "Your device may be muted and volume is at 0%.",
          }) || "";
      } else if (isVolumeMuted) {
        message =
          "Your device volume is at 0%. Please increase volume to hear audio.";
      } else {
        message =
          Platform.select({
            ios: "Your device is in silent mode. Please turn off silent mode to hear audio.",
            android: `Your device is in ${mode} mode. Please switch to normal mode to hear audio.`,
            default: "Your device may be in silent mode.",
          }) || "";
      }

      Alert.alert("Cannot Hear Audio", message, [
        {
          text: "Play Anyway",
          style: "default",
          onPress: () => {
            // User chose to play anyway
            onProceed?.();
          },
        },
        {
          text: "Cancel",
          style: "cancel",
          // User cancelled - do nothing
        },
      ]);
    } else {
      // Device is not in silent mode and volume is up, proceed immediately
      onProceed?.();
    }
  };

  return { isSilent, checkAndAlert };
}
