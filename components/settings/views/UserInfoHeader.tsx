import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface UserInfoHeaderProps {
  user: any; // Using any for simplicity as per existing code usage of user object
  colors: typeof Colors.light;
}

export function UserInfoHeader({ user, colors }: UserInfoHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={[styles.avatarContainer, { backgroundColor: colors.tint }]}>
        <ThemedText style={styles.avatarText}>
          {user?.displayName?.charAt(0).toUpperCase() || "U"}
        </ThemedText>
      </View>
      <ThemedText type="title" style={styles.name}>
        {user?.displayName || "User"}
      </ThemedText>
      <ThemedText style={styles.email}>{user?.email}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
});
