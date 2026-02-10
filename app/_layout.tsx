import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { AudioPlayerProvider } from '@/context/audio-player-context';
import { FavoritesProvider } from '@/context/favorites-context';
import { ProgressProvider } from '@/context/progress-context';
import { ReviewsProvider } from '@/context/reviews-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to welcome if not authenticated
      router.replace('/(auth)/welcome');
    } else if (user && inAuthGroup) {
      // Redirect to tabs if authenticated and in auth group
      router.replace('/(tabs)');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(author-tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin-tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="player" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ProgressProvider>
          <ReviewsProvider>
            <AudioPlayerProvider>
              <RootLayoutNav />
            </AudioPlayerProvider>
          </ReviewsProvider>
        </ProgressProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
