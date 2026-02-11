import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GuestViewProps {
  colors: typeof Colors.light;
  cardBgColor: string;
}

export function GuestView({ colors, cardBgColor }: GuestViewProps) {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: colors.icon + "40" },
              ]}
            >
              <IconSymbol size={50} name="person.fill" color={colors.icon} />
            </View>
            <ThemedText type="title" style={styles.name}>
              Guest User
            </ThemedText>
            <ThemedText style={styles.email}>
              Browsing in preview mode
            </ThemedText>
          </View>

          <View
            style={[
              styles.guestBanner,
              {
                backgroundColor: colors.tint + "20",
                borderColor: colors.tint,
              },
            ]}
          >
            <IconSymbol size={24} name="info.circle.fill" color={colors.tint} />
            <View style={styles.guestBannerText}>
              <ThemedText
                style={[styles.guestBannerTitle, { color: colors.tint }]}
              >
                Create an Account
              </ThemedText>
              <ThemedText style={styles.guestBannerSubtitle}>
                Unlock all features and sync your progress across devices
              </ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Features Requiring Sign Up
            </ThemedText>

            <View
              style={[styles.featureItem, { backgroundColor: cardBgColor }]}
            >
              <IconSymbol size={24} name="heart.fill" color={colors.icon} />
              <ThemedText style={styles.featureText}>
                Save favorite audiobooks
              </ThemedText>
            </View>

            <View
              style={[styles.featureItem, { backgroundColor: cardBgColor }]}
            >
              <IconSymbol size={24} name="chart.bar.fill" color={colors.icon} />
              <ThemedText style={styles.featureText}>
                Track listening progress
              </ThemedText>
            </View>

            <View
              style={[styles.featureItem, { backgroundColor: cardBgColor }]}
            >
              <IconSymbol
                size={24}
                name="play.circle.fill"
                color={colors.icon}
              />
              <ThemedText style={styles.featureText}>
                Unlimited playback access
              </ThemedText>
            </View>

            <View
              style={[styles.featureItem, { backgroundColor: cardBgColor }]}
            >
              <IconSymbol size={24} name="star.fill" color={colors.icon} />
              <ThemedText style={styles.featureText}>
                Write and share reviews
              </ThemedText>
            </View>

            <View
              style={[styles.featureItem, { backgroundColor: cardBgColor }]}
            >
              <IconSymbol size={24} name="icloud.fill" color={colors.icon} />
              <ThemedText style={styles.featureText}>
                Sync across all devices
              </ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <Pressable
              style={[styles.loginButton, { borderColor: colors.tint }]}
              onPress={() => router.push("/(auth)/login")}
            >
              <ThemedText
                style={[styles.loginButtonText, { color: colors.tint }]}
              >
                Log In to Existing Account
              </ThemedText>
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
  name: {
    fontSize: 24,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  guestBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  guestBannerText: {
    flex: 1,
  },
  guestBannerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  guestBannerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
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
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
