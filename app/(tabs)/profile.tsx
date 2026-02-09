import { StyleSheet, View, Pressable, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/(auth)/welcome');
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to sign out');
          }
        },
      },
    ]);
  };

  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.tint }]}>
            <ThemedText style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.name}>
            {user?.displayName || 'User'}
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
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
            <View style={styles.menuItemLeft}>
              <IconSymbol size={24} name="person.fill" color={colors.icon} />
              <ThemedText style={styles.menuItemText}>Edit Profile</ThemedText>
            </View>
            <IconSymbol size={20} name="chevron.right" color={colors.icon} />
          </Pressable>

          <Pressable
            style={[styles.menuItem, { backgroundColor: cardBgColor }]}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
            <View style={styles.menuItemLeft}>
              <IconSymbol size={24} name="bell.fill" color={colors.icon} />
              <ThemedText style={styles.menuItemText}>Notifications</ThemedText>
            </View>
            <IconSymbol size={20} name="chevron.right" color={colors.icon} />
          </Pressable>

          <Pressable
            style={[styles.menuItem, { backgroundColor: cardBgColor }]}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
            <View style={styles.menuItemLeft}>
              <IconSymbol size={24} name="lock.fill" color={colors.icon} />
              <ThemedText style={styles.menuItemText}>Privacy & Security</ThemedText>
            </View>
            <IconSymbol size={20} name="chevron.right" color={colors.icon} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

          <Pressable
            style={[styles.menuItem, { backgroundColor: cardBgColor }]}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
            <View style={styles.menuItemLeft}>
              <IconSymbol size={24} name="speaker.wave.2.fill" color={colors.icon} />
              <ThemedText style={styles.menuItemText}>Audio Quality</ThemedText>
            </View>
            <IconSymbol size={20} name="chevron.right" color={colors.icon} />
          </Pressable>

          <Pressable
            style={[styles.menuItem, { backgroundColor: cardBgColor }]}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
            <View style={styles.menuItemLeft}>
              <IconSymbol size={24} name="arrow.down.circle.fill" color={colors.icon} />
              <ThemedText style={styles.menuItemText}>Download Settings</ThemedText>
            </View>
            <IconSymbol size={20} name="chevron.right" color={colors.icon} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable
            style={[styles.menuItem, styles.signOutButton]}
            onPress={handleSignOut}>
            <View style={styles.menuItemLeft}>
              <IconSymbol size={24} name="rectangle.portrait.and.arrow.right" color="#FF3B30" />
              <ThemedText style={[styles.menuItemText, styles.signOutText]}>
                Sign Out
              </ThemedText>
            </View>
          </Pressable>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
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
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  signOutText: {
    color: '#FF3B30',
  },
});
