// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "arrow.left": "arrow-back",
  "chevron.left.forwardslash.chevron.right": "code",

  // Playback & Media
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "forward.fill": "fast-forward",
  "backward.fill": "fast-rewind",
  "forward.end.fill": "skip-next",
  "backward.end.fill": "skip-previous",
  waveform: "graphic-eq",
  "speaker.wave.2.fill": "volume-up",
  "mic.fill": "mic",

  // Common UI
  "person.fill": "person",
  "person.3.fill": "group",
  "heart.fill": "favorite",
  heart: "favorite-border",
  "star.fill": "star",
  star: "star-border",
  "book.fill": "menu-book",
  "books.vertical.fill": "library-books",
  sparkles: "auto-awesome",
  "bookmark.fill": "bookmark",
  "lock.fill": "lock",
  "bell.fill": "notifications",
  "bell.badge.fill": "notifications-active",
  "icloud.fill": "cloud",
  magnifyingglass: "search",
  clock: "access-time",
  "eye.fill": "visibility",

  // Actions & Controls
  xmark: "close",
  "xmark.circle.fill": "cancel",
  checkmark: "check",
  "checkmark.circle.fill": "check-circle",
  "plus.circle.fill": "add-circle",
  "info.circle.fill": "info",
  "arrow.down.circle.fill": "download",
  "play.circle.fill": "play-circle-filled",

  // Profile & Settings
  "gearshape.fill": "settings",
  pencil: "edit",
  "shield.fill": "security",
  "lock.shield.fill": "admin-panel-settings",
  "rectangle.portrait.and.arrow.right": "logout",
  "paperplane.fill": "send",

  // Charts & Analytics
  "chart.bar.fill": "bar-chart",
  "chart.bar.doc.horizontal": "insert-chart",
  "chart.line.uptrend.xyaxis": "show-chart",

  // Money & Commerce
  "dollarsign.circle.fill": "monetization-on",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
