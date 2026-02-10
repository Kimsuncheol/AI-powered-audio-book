import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { UserRole } from "@/types/user";
import { Pressable, StyleSheet, View } from "react-native";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  roles: Array<{
    value: UserRole;
    label: string;
    description: string;
    icon: string;
  }>;
}

export function RoleSelector({
  selectedRole,
  onSelectRole,
  roles,
}: RoleSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const inputBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const activeRoleTextColor = colorScheme === "dark" ? "#000000" : "#FFFFFF";

  return (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.label}>Account Type</ThemedText>
      <View style={styles.roleContainer}>
        {roles.map((r) => (
          <Pressable
            key={r.value}
            style={[
              styles.roleCard,
              { backgroundColor: inputBgColor },
              selectedRole === r.value && {
                backgroundColor: colors.tint,
                borderColor: colors.tint,
                ...styles.shadow,
              },
            ]}
            onPress={() => onSelectRole(r.value)}
          >
            <IconSymbol
              size={24}
              name={r.icon as any}
              color={
                selectedRole === r.value ? activeRoleTextColor : colors.icon
              }
            />
            <ThemedText
              style={[
                styles.roleLabel,
                selectedRole === r.value && { color: activeRoleTextColor },
              ]}
            >
              {r.label}
            </ThemedText>
            <ThemedText
              style={[
                styles.roleDescription,
                selectedRole === r.value && {
                  color: activeRoleTextColor,
                  opacity: 0.9,
                },
              ]}
            >
              {r.description}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  roleContainer: {
    flexDirection: "row",
    gap: 10,
  },
  roleCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  roleDescription: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
