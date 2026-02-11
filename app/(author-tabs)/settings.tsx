import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthorSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, userProfile, signOut } = useAuth();
  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/login");
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to sign out");
          }
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Author Header */}
          <View style={styles.header}>
            <View
              style={[styles.avatarContainer, { backgroundColor: colors.tint }]}
            >
              <ThemedText style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || "A"}
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.name}>
              {user?.displayName || "Author"}
            </ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
            <View style={[styles.roleBadge, { backgroundColor: colors.tint }]}>
              <IconSymbol size={14} name="pencil" color="#FFFFFF" />
              <ThemedText style={styles.roleText}>Author Account</ThemedText>
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(author-tabs)/edit-profile")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol size={24} name="person.fill" color={colors.icon} />
                <ThemedText style={styles.menuItemText}>
                  Edit Profile
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(author-tabs)/earnings")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="dollarsign.circle.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>Earnings</ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>
          </View>

          {/* Content Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Content</ThemedText>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(author-tabs)/my-books")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="books.vertical.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>My Books</ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(author-tabs)/analytics")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="chart.bar.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>Analytics</ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>
          </View>

          {/* Sign Out */}
          <View style={styles.section}>
            <Pressable
              style={[styles.menuItem, styles.signOutButton]}
              onPress={handleSignOut}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="rectangle.portrait.and.arrow.right"
                  color="#FF3B30"
                />
                <ThemedText style={[styles.menuItemText, styles.signOutText]}>
                  Sign Out
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 24,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  signOutText: {
    color: "#FF3B30",
  },
});
