import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { MiniPlayer } from "@/components/mini-player";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { ProgressProvider } from "@/context/progress-context";
import { ReviewsProvider } from "@/context/reviews-context";
import { SettingsProvider } from "@/context/settings-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading, isGuest } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Redirect guests to library only on initial load (no segments)
    if (isGuest && !segments[0]) {
      router.replace("/(tabs)");
      return;
    }

    // Redirect authenticated users from auth screens to appropriate tabs
    if (user && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, isGuest, segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(author-tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin-tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="player"
          options={{ headerShown: false, presentation: "fullScreenModal" }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <MiniPlayer />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SettingsProvider>
          <FavoritesProvider>
            <ProgressProvider>
              <ReviewsProvider>
                <AudioPlayerProvider>
                  <RootLayoutNav />
                </AudioPlayerProvider>
              </ReviewsProvider>
            </ProgressProvider>
          </FavoritesProvider>
        </SettingsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
