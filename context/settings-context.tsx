import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type AudioQuality = "low" | "medium" | "high" | "ultra";
export type DownloadQuality = "standard" | "high";

export interface NotificationSettings {
  newReleases: boolean;
  recommendations: boolean;
  updates: boolean;
  marketing: boolean;
}

export interface DownloadSettings {
  downloadQuality: DownloadQuality;
  downloadOnWiFiOnly: boolean;
  autoDownload: boolean;
}

export interface CarModeSettings {
  enabled: boolean;
  autoLaunchOnBluetooth: boolean;
  keepScreenOn: boolean;
  increasedBrightness: boolean;
  simplifiedControls: boolean;
}

export interface AutoPlaySettings {
  autoPlayNextChapter: boolean;
  autoPlayOnBluetooth: boolean;
  autoPlayOnHeadphones: boolean;
  autoResumeOnReturn: boolean;
  continueAcrossBooks: boolean;
}

export interface AppSettings {
  audioQuality: AudioQuality;
  notifications: NotificationSettings;
  downloadSettings: DownloadSettings;
  carMode: CarModeSettings;
  autoPlay: AutoPlaySettings;
}

interface SettingsContextType {
  settings: AppSettings;
  updateAudioQuality: (quality: AudioQuality) => Promise<void>;
  updateNotifications: (notifications: NotificationSettings) => Promise<void>;
  updateDownloadSettings: (downloadSettings: DownloadSettings) => Promise<void>;
  updateCarMode: (carMode: CarModeSettings) => Promise<void>;
  updateAutoPlay: (autoPlay: AutoPlaySettings) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const SETTINGS_KEY = "@app:settings";

const defaultSettings: AppSettings = {
  audioQuality: "high",
  notifications: {
    newReleases: true,
    recommendations: true,
    updates: true,
    marketing: false,
  },
  downloadSettings: {
    downloadQuality: "high",
    downloadOnWiFiOnly: true,
    autoDownload: false,
  },
  carMode: {
    enabled: false,
    autoLaunchOnBluetooth: false,
    keepScreenOn: true,
    increasedBrightness: true,
    simplifiedControls: true,
  },
  autoPlay: {
    autoPlayNextChapter: true,
    autoPlayOnBluetooth: false,
    autoPlayOnHeadphones: false,
    autoResumeOnReturn: true,
    continueAcrossBooks: false,
  },
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const updateAudioQuality = async (quality: AudioQuality) => {
    await saveSettings({ ...settings, audioQuality: quality });
  };

  const updateNotifications = async (notifications: NotificationSettings) => {
    await saveSettings({ ...settings, notifications });
  };

  const updateDownloadSettings = async (
    downloadSettings: DownloadSettings
  ) => {
    await saveSettings({ ...settings, downloadSettings });
  };

  const updateCarMode = async (carMode: CarModeSettings) => {
    await saveSettings({ ...settings, carMode });
  };

  const updateAutoPlay = async (autoPlay: AutoPlaySettings) => {
    await saveSettings({ ...settings, autoPlay });
  };

  const value = {
    settings,
    updateAudioQuality,
    updateNotifications,
    updateDownloadSettings,
    updateCarMode,
    updateAutoPlay,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
