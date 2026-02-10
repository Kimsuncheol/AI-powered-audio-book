import { AutoPlaySettings } from "@/context/settings-context";
import { View } from "react-native";
import { SettingToggleItem } from "./common/SettingToggleItem";

interface AutoPlaySettingsSectionProps {
  autoPlay: AutoPlaySettings;
  onAutoPlayChange: (autoPlay: AutoPlaySettings) => void;
  colors: {
    tint: string;
    text: string;
    icon: string;
  };
  cardBgColor: string;
}

export function AutoPlaySettingsSection({
  autoPlay,
  onAutoPlayChange,
  colors,
  cardBgColor,
}: AutoPlaySettingsSectionProps) {
  const handleToggle = (key: keyof AutoPlaySettings) => {
    onAutoPlayChange({
      ...autoPlay,
      [key]: !autoPlay[key],
    });
  };

  return (
    <View>
      <SettingToggleItem
        icon="play.circle.fill"
        label="Auto-Play Next Chapter"
        description="Automatically play next chapter when current ends"
        value={autoPlay.autoPlayNextChapter}
        onValueChange={() => handleToggle("autoPlayNextChapter")}
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <SettingToggleItem
        icon="bluetooth"
        label="Auto-Play on Bluetooth"
        description="Start playback when Bluetooth device connects"
        value={autoPlay.autoPlayOnBluetooth}
        onValueChange={() => handleToggle("autoPlayOnBluetooth")}
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <SettingToggleItem
        icon="headphones"
        label="Auto-Play on Headphones"
        description="Start playback when headphones are plugged in"
        value={autoPlay.autoPlayOnHeadphones}
        onValueChange={() => handleToggle("autoPlayOnHeadphones")}
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <SettingToggleItem
        icon="arrow.clockwise"
        label="Auto-Resume on Return"
        description="Continue playback when returning to app"
        value={autoPlay.autoResumeOnReturn}
        onValueChange={() => handleToggle("autoResumeOnReturn")}
        colors={colors}
        cardBgColor={cardBgColor}
      />

      <SettingToggleItem
        icon="forward.end.fill"
        label="Continue Across Books"
        description="Auto-play next book in queue when finished"
        value={autoPlay.continueAcrossBooks}
        onValueChange={() => handleToggle("continueAcrossBooks")}
        colors={colors}
        cardBgColor={cardBgColor}
      />
    </View>
  );
}
