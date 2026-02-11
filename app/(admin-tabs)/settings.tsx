import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
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

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View
              style={[styles.avatarContainer, { backgroundColor: "#FF3B30" }]}
            >
              <ThemedText style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || "A"}
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.name}>
              {user?.displayName || "Admin"}
            </ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
            <View style={[styles.roleBadge, { backgroundColor: "#FF3B30" }]}>
              <IconSymbol size={14} name="shield.fill" color="#FFFFFF" />
              <ThemedText style={styles.roleText}>Administrator</ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Platform Settings
            </ThemedText>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(admin-tabs)/general-settings")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="gearshape.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>
                  General Settings
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(admin-tabs)/security")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="lock.shield.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>Security</ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>

            <Pressable
              style={[styles.menuItem, { backgroundColor: cardBgColor }]}
              onPress={() => router.push("/(admin-tabs)/notifications")}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  size={24}
                  name="bell.badge.fill"
                  color={colors.icon}
                />
                <ThemedText style={styles.menuItemText}>
                  Notifications
                </ThemedText>
              </View>
              <IconSymbol size={20} name="chevron.right" color={colors.icon} />
            </Pressable>
          </View>

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
