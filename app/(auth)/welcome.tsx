import { StyleSheet, View, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { enterGuestMode } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <IconSymbol size={80} name="book.fill" color={colors.tint} />
        <ThemedText type="title" style={styles.title}>
          AI AudioBook
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Listen to your favorite books with AI-powered features
        </ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.feature}>
          <IconSymbol size={32} name="waveform" color={colors.tint} />
          <ThemedText style={styles.featureText}>
            High-quality audio narration
          </ThemedText>
        </View>

        <View style={styles.feature}>
          <IconSymbol size={32} name="sparkles" color={colors.tint} />
          <ThemedText style={styles.featureText}>
            AI-powered summaries and insights
          </ThemedText>
        </View>

        <View style={styles.feature}>
          <IconSymbol size={32} name="bookmark.fill" color={colors.tint} />
          <ThemedText style={styles.featureText}>
            Save bookmarks and take notes
          </ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/(auth)/sign-up" asChild>
          <Pressable style={[styles.button, { backgroundColor: colors.tint }]}>
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </Pressable>
        </Link>

        <Link href="/(auth)/login" asChild>
          <Pressable style={[styles.button, styles.buttonOutline]}>
            <ThemedText style={[styles.buttonText, { color: colors.tint }]}>
              Log In
            </ThemedText>
          </Pressable>
        </Link>

        <Pressable
          style={styles.buttonGuest}
          onPress={async () => {
            await enterGuestMode();
            router.push('/(tabs)');
          }}
        >
          <ThemedText style={[styles.buttonTextSecondary, { color: colors.text }]}>
            Browse as Guest
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  content: {
    gap: 30,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonGuest: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
});
