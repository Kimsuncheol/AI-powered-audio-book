import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function MyBooksScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cardBgColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            My Books
          </ThemedText>
          <Pressable style={[styles.addButton, { backgroundColor: colors.tint }]}>
            <IconSymbol size={20} name="plus" color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={[styles.emptyState, { backgroundColor: cardBgColor }]}>
          <IconSymbol size={60} name="book.closed" color={colors.icon} />
          <ThemedText style={styles.emptyText}>No books yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Upload your first audiobook to get started
          </ThemedText>
          <Pressable style={[styles.uploadButton, { backgroundColor: colors.tint }]}>
            <ThemedText style={styles.uploadButtonText}>Upload Audiobook</ThemedText>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  uploadButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
