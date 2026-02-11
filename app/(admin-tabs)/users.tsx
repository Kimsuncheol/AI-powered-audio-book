import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { UserManagement } from "@/types/admin";
import { UserRole } from "@/types/user";
import {
  changeUserRole,
  deleteUser,
  getAllUsers,
  restoreUser,
  suspendUser,
} from "@/utils/admin";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsersScreen() {
  const { user: currentUser } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "activity">("date");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "suspended" | "deleted">("all");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const cardBgColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7";
  const cardBorderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";
  const modalBgColor = colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF";

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    Alert.alert(
      "Change User Role",
      `Change role to ${newRole}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await changeUserRole(userId, newRole, currentUser?.uid || "");
              await loadUsers();
              Alert.alert("Success", "User role changed successfully");
            } catch (error) {
              console.error("Error changing role:", error);
              Alert.alert("Error", "Failed to change user role");
            }
          },
        },
      ],
    );
  };

  const handleSuspendUser = (userId: string) => {
    setSelectedUser(users.find((u) => u.uid === userId) || null);
    setModalVisible(true);
  };

  const confirmSuspension = async () => {
    if (!selectedUser || !suspensionReason.trim()) {
      Alert.alert("Error", "Please provide a reason for suspension");
      return;
    }

    try {
      await suspendUser(
        selectedUser.uid,
        suspensionReason,
        currentUser?.uid || "",
        currentUser?.displayName || "Admin",
      );
      await loadUsers();
      setModalVisible(false);
      setSuspensionReason("");
      Alert.alert("Success", "User suspended successfully");
    } catch (error) {
      console.error("Error suspending user:", error);
      Alert.alert("Error", "Failed to suspend user");
    }
  };

  const handleRestoreUser = (userId: string) => {
    Alert.alert(
      "Restore User",
      "Restore this user's account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          onPress: async () => {
            try {
              await restoreUser(userId, currentUser?.uid || "");
              await loadUsers();
              Alert.alert("Success", "User restored successfully");
            } catch (error) {
              console.error("Error restoring user:", error);
              Alert.alert("Error", "Failed to restore user");
            }
          },
        },
      ],
    );
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      "Delete User",
      "This will permanently delete the user account. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(userId, currentUser?.uid || "");
              await loadUsers();
              Alert.alert("Success", "User deleted successfully");
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ],
    );
  };

  // Bulk action handlers
  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedUserIds(new Set());
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };

  const selectAll = () => {
    const selectableUsers = filteredUsers.filter(
      (u) => u.uid !== currentUser?.uid && u.status === "active",
    );
    setSelectedUserIds(new Set(selectableUsers.map((u) => u.uid)));
  };

  const deselectAll = () => {
    setSelectedUserIds(new Set());
  };

  const handleBulkSuspend = () => {
    if (selectedUserIds.size === 0) return;

    Alert.alert(
      "Bulk Suspend Users",
      `Suspend ${selectedUserIds.size} selected user(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Suspend",
          style: "destructive",
          onPress: () => {
            setSelectedUser(null);
            setModalVisible(true);
          },
        },
      ],
    );
  };

  const handleBulkRoleChange = (newRole: UserRole) => {
    if (selectedUserIds.size === 0) return;

    Alert.alert(
      "Bulk Change Role",
      `Change role to ${newRole} for ${selectedUserIds.size} selected user(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await Promise.all(
                Array.from(selectedUserIds).map((userId) =>
                  changeUserRole(userId, newRole, currentUser?.uid || ""),
                ),
              );
              await loadUsers();
              setSelectedUserIds(new Set());
              setBulkMode(false);
              Alert.alert(
                "Success",
                `Updated ${selectedUserIds.size} user(s) successfully`,
              );
            } catch (error) {
              console.error("Error bulk changing roles:", error);
              Alert.alert("Error", "Failed to change roles for some users");
            }
          },
        },
      ],
    );
  };

  const confirmBulkSuspension = async () => {
    if (!suspensionReason.trim() || selectedUserIds.size === 0) {
      Alert.alert("Error", "Please provide a reason for suspension");
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedUserIds).map((userId) =>
          suspendUser(
            userId,
            suspensionReason,
            currentUser?.uid || "",
            currentUser?.displayName || "Admin",
          ),
        ),
      );
      await loadUsers();
      setModalVisible(false);
      setSuspensionReason("");
      setSelectedUserIds(new Set());
      setBulkMode(false);
      Alert.alert(
        "Success",
        `Suspended ${selectedUserIds.size} user(s) successfully`,
      );
    } catch (error) {
      console.error("Error bulk suspending users:", error);
      Alert.alert("Error", "Failed to suspend some users");
    }
  };

  const filteredUsers = users
    .filter((u) => {
      // Role filter
      if (filterRole !== "all" && u.role !== filterRole) return false;

      // Status filter
      if (filterStatus !== "all" && u.status !== filterStatus) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          u.displayName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.displayName.localeCompare(b.displayName);
        case "activity":
          const aTime = a.lastActive?.getTime() || 0;
          const bTime = b.lastActive?.getTime() || 0;
          return bTime - aTime;
        case "date":
        default:
          return b.joinedAt.getTime() - a.joinedAt.getTime();
      }
    });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "#FF3B30";
      case "author":
        return "#34C759";
      default:
        return "#007AFF";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "#34C759";
      case "suspended":
        return "#FF9500";
      case "deleted":
        return "#FF3B30";
      default:
        return "#8E8E93";
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <ThemedText type="title" style={styles.title}>
                User Management
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                {filteredUsers.length} of {users.length} users
              </ThemedText>
            </View>
            <Pressable
              style={[
                styles.bulkModeButton,
                {
                  backgroundColor: bulkMode ? colors.tint : cardBgColor,
                  borderColor: cardBorderColor,
                },
              ]}
              onPress={toggleBulkMode}
            >
              <IconSymbol
                name={bulkMode ? "checkmark.square.fill" : "square.on.square"}
                size={20}
                color={bulkMode ? "#FFFFFF" : colors.icon}
              />
              <ThemedText
                style={[
                  styles.bulkModeButtonText,
                  { color: bulkMode ? "#FFFFFF" : colors.text },
                ]}
              >
                {bulkMode ? "Cancel" : "Select"}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: cardBgColor, borderColor: cardBorderColor },
            ]}
          >
            <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by name or email"
              placeholderTextColor={colors.icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Controls */}
        <View style={styles.filtersRow}>
          {/* Role Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            <ThemedText style={styles.filterLabel}>Role:</ThemedText>
            {(["all", "user", "author", "admin"] as const).map((role) => (
              <Pressable
                key={role}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      filterRole === role ? colors.tint : cardBgColor,
                    borderColor: cardBorderColor,
                  },
                ]}
                onPress={() => setFilterRole(role)}
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    { color: filterRole === role ? "#FFFFFF" : colors.text },
                  ]}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filtersRow}>
          {/* Status Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            <ThemedText style={styles.filterLabel}>Status:</ThemedText>
            {(["all", "active", "suspended", "deleted"] as const).map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      filterStatus === status ? colors.tint : cardBgColor,
                    borderColor: cardBorderColor,
                  },
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    { color: filterStatus === status ? "#FFFFFF" : colors.text },
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Sort Options / Bulk Selection Controls */}
        {bulkMode ? (
          <View style={styles.bulkControlsContainer}>
            <View style={styles.bulkSelectionInfo}>
              <ThemedText style={styles.bulkSelectionText}>
                {selectedUserIds.size} selected
              </ThemedText>
            </View>
            <View style={styles.bulkSelectionButtons}>
              <Pressable
                style={[styles.bulkControlButton, { borderColor: cardBorderColor }]}
                onPress={selectAll}
              >
                <ThemedText style={styles.bulkControlButtonText}>
                  Select All
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.bulkControlButton, { borderColor: cardBorderColor }]}
                onPress={deselectAll}
              >
                <ThemedText style={styles.bulkControlButtonText}>
                  Deselect All
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.sortContainer}>
            <ThemedText style={styles.sortLabel}>Sort by:</ThemedText>
            <View style={styles.sortButtons}>
              {(
                [
                  { value: "date", label: "Newest" },
                  { value: "name", label: "Name" },
                  { value: "activity", label: "Activity" },
                ] as const
              ).map((sort) => (
                <Pressable
                  key={sort.value}
                  style={[
                    styles.sortButton,
                    {
                      backgroundColor:
                        sortBy === sort.value ? colors.tint + "20" : "transparent",
                      borderColor: cardBorderColor,
                    },
                  ]}
                  onPress={() => setSortBy(sort.value)}
                >
                  <ThemedText
                    style={[
                      styles.sortButtonText,
                      { color: sortBy === sort.value ? colors.tint : colors.text },
                    ]}
                  >
                    {sort.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
        >
          {filteredUsers.map((user) => {
            const isSelected = selectedUserIds.has(user.uid);
            const isSelectable = user.uid !== currentUser?.uid && user.status === "active";

            return (
              <Pressable
                key={user.uid}
                style={[
                  styles.userCard,
                  {
                    backgroundColor: cardBgColor,
                    borderColor: isSelected ? colors.tint : cardBorderColor,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => {
                  if (bulkMode && isSelectable) {
                    toggleUserSelection(user.uid);
                  }
                }}
                disabled={!bulkMode}
              >
                {bulkMode && (
                  <View style={styles.checkboxContainer}>
                    <Pressable
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isSelected ? colors.tint : "transparent",
                          borderColor: isSelectable ? colors.tint : cardBorderColor,
                        },
                      ]}
                      onPress={() => isSelectable && toggleUserSelection(user.uid)}
                      disabled={!isSelectable}
                    >
                      {isSelected && (
                        <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </Pressable>
                  </View>
                )}

                <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userName}>
                    {user.displayName}
                  </ThemedText>
                  <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                </View>
                <View style={styles.badges}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: getRoleBadgeColor(user.role) },
                    ]}
                  >
                    <ThemedText style={styles.badgeText}>
                      {user.role}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: getStatusBadgeColor(user.status) },
                    ]}
                  >
                    <ThemedText style={styles.badgeText}>
                      {user.status}
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>Joined</ThemedText>
                  <ThemedText style={styles.statValue}>
                    {user.joinedAt.toLocaleDateString()}
                  </ThemedText>
                </View>
                {user.role === "author" && (
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statLabel}>Books</ThemedText>
                    <ThemedText style={styles.statValue}>
                      {user.audiobooksAuthored || 0}
                    </ThemedText>
                  </View>
                )}
              </View>

              {user.status === "suspended" && user.suspensionReason && (
                <View style={styles.suspensionInfo}>
                  <ThemedText style={styles.suspensionReason}>
                    Reason: {user.suspensionReason}
                  </ThemedText>
                </View>
              )}

              <View style={styles.actionsRow}>
                {user.status === "active" && user.uid !== currentUser?.uid && (
                  <>
                    <Pressable
                      style={[styles.actionButton, { borderColor: cardBorderColor }]}
                      onPress={() => {
                        Alert.alert("Change Role", "Select new role:", [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "User",
                            onPress: () => handleChangeRole(user.uid, "user"),
                          },
                          {
                            text: "Author",
                            onPress: () => handleChangeRole(user.uid, "author"),
                          },
                          {
                            text: "Admin",
                            onPress: () => handleChangeRole(user.uid, "admin"),
                          },
                        ]);
                      }}
                    >
                      <IconSymbol
                        name="arrow.triangle.2.circlepath"
                        size={16}
                        color={colors.icon}
                      />
                      <ThemedText style={styles.actionButtonText}>
                        Change Role
                      </ThemedText>
                    </Pressable>

                    <Pressable
                      style={[styles.actionButton, { borderColor: cardBorderColor }]}
                      onPress={() => handleSuspendUser(user.uid)}
                    >
                      <IconSymbol name="xmark.circle" size={16} color={colors.icon} />
                      <ThemedText style={styles.actionButtonText}>
                        Suspend
                      </ThemedText>
                    </Pressable>
                  </>
                )}

                {user.status === "suspended" && (
                  <Pressable
                    style={[styles.actionButton, { borderColor: cardBorderColor }]}
                    onPress={() => handleRestoreUser(user.uid)}
                  >
                    <IconSymbol
                      name="arrow.uturn.backward"
                      size={16}
                      color={colors.icon}
                    />
                    <ThemedText style={styles.actionButtonText}>
                      Restore
                    </ThemedText>
                  </Pressable>
                )}

                {user.uid !== currentUser?.uid && (
                  <Pressable
                    style={[styles.actionButton, { borderColor: "#FF3B30" }]}
                    onPress={() => handleDeleteUser(user.uid)}
                  >
                    <IconSymbol name="trash" size={16} color="#FF3B30" />
                    <ThemedText style={[styles.actionButtonText, { color: "#FF3B30" }]}>
                      Delete
                    </ThemedText>
                  </Pressable>
                )}
              </View>
            </Pressable>
          );
        })}

          {filteredUsers.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol name="person.crop.circle.badge.xmark" size={60} color={colors.icon} />
              <ThemedText style={styles.emptyText}>No users found</ThemedText>
            </View>
          )}
        </ScrollView>

        {/* Bulk Action Bar */}
        {bulkMode && selectedUserIds.size > 0 && (
          <View
            style={[
              styles.bulkActionBar,
              { backgroundColor: modalBgColor, borderTopColor: cardBorderColor },
            ]}
          >
            <View style={styles.bulkActionButtons}>
              <Pressable
                style={[styles.bulkActionButton, { backgroundColor: "#FF9500" }]}
                onPress={handleBulkSuspend}
              >
                <IconSymbol name="xmark.circle" size={20} color="#FFFFFF" />
                <ThemedText style={styles.bulkActionButtonText}>Suspend</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.bulkActionButton, { backgroundColor: colors.tint }]}
                onPress={() => {
                  Alert.alert("Change Role", "Select new role for selected users:", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "User",
                      onPress: () => handleBulkRoleChange("user"),
                    },
                    {
                      text: "Author",
                      onPress: () => handleBulkRoleChange("author"),
                    },
                    {
                      text: "Admin",
                      onPress: () => handleBulkRoleChange("admin"),
                    },
                  ]);
                }}
              >
                <IconSymbol
                  name="arrow.triangle.2.circlepath"
                  size={20}
                  color="#FFFFFF"
                />
                <ThemedText style={styles.bulkActionButtonText}>
                  Change Role
                </ThemedText>
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* Suspension Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <ThemedText style={styles.modalTitle}>
              Suspend {selectedUserIds.size > 0 ? `${selectedUserIds.size} Users` : "User"}
            </ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              Please provide a reason for suspension
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: cardBgColor,
                  borderColor: cardBorderColor,
                  color: colors.text,
                },
              ]}
              placeholder="Reason for suspension"
              placeholderTextColor={colors.icon}
              value={suspensionReason}
              onChangeText={setSuspensionReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: cardBgColor }]}
                onPress={() => {
                  setModalVisible(false);
                  setSuspensionReason("");
                }}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#FF3B30" }]}
                onPress={selectedUserIds.size > 0 ? confirmBulkSuspension : confirmSuspension}
              >
                <ThemedText style={{ color: "#FFFFFF" }}>Suspend</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  bulkModeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  bulkModeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersRow: {
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  filterContent: {
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
    marginRight: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  bulkControlsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  bulkSelectionInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bulkSelectionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bulkSelectionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  bulkControlButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  bulkControlButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  checkboxContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  userStats: {
    flexDirection: "row",
    gap: 24,
  },
  statItem: {
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  suspensionInfo: {
    padding: 12,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 8,
  },
  suspensionReason: {
    fontSize: 13,
    color: "#FF3B30",
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  bulkActionBar: {
    borderTopWidth: 1,
    padding: 16,
    paddingBottom: 32,
  },
  bulkActionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  bulkActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  bulkActionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
