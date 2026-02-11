import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import {
  ActivityLog,
  BookMetric,
  ContentModeration,
  DashboardStats,
  PlatformAnalytics,
  UserManagement,
} from "@/types/admin";
import { AudioBook } from "@/types/audiobook";
import { UserProfile, UserRole } from "@/types/user";

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get user counts by role
    const usersSnap = await getDocs(collection(db, "users"));
    const users = usersSnap.docs.map((doc) => doc.data());

    const totalUsers = users.filter((u) => u.role === "user").length;
    const totalAuthors = users.filter((u) => u.role === "author").length;
    const totalAdmins = users.filter((u) => u.role === "admin").length;

    // Get audiobooks count
    const audiobooksSnap = await getDocs(collection(db, "audiobooks"));
    const totalAudiobooks = audiobooksSnap.size;

    // Get pending content
    const pendingSnap = await getDocs(
      query(collection(db, "audiobooks"), where("status", "==", "pending")),
    );
    const pendingContent = pendingSnap.size;

    // Get recent activity (last 10 items)
    const activityQuery = query(
      collection(db, "activity_logs"),
      orderBy("timestamp", "desc"),
      limit(10),
    );
    const activitySnap = await getDocs(activityQuery);
    const recentActivity: ActivityLog[] = activitySnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ActivityLog, "id" | "timestamp">),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));

    return {
      totalUsers,
      totalAuthors,
      totalAdmins,
      totalAudiobooks,
      pendingContent,
      activeListeners: 0, // TODO: Implement real-time listener tracking
      totalPlaytime: 0, // TODO: Aggregate from user progress
      recentActivity,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

/**
 * Get all users with management data
 */
export async function getAllUsers(): Promise<UserManagement[]> {
  try {
    const usersSnap = await getDocs(collection(db, "users"));

    const users: UserManagement[] = usersSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "Unknown",
        role: data.role || "user",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        photoURL: data.photoURL,
        bio: data.bio,
        status: data.status || "active",
        lastActive: data.lastActive?.toDate(),
        audiobooksListened: data.audiobooksListened || 0,
        audiobooksAuthored: data.audiobooksAuthored || 0,
        joinedAt: data.createdAt?.toDate() || new Date(),
        suspensionReason: data.suspensionReason,
        suspendedBy: data.suspendedBy,
        suspendedAt: data.suspendedAt?.toDate(),
      };
    });

    return users.sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Change user role
 */
export async function changeUserRole(
  userId: string,
  newRole: UserRole,
  adminId: string,
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: Timestamp.now(),
    });

    // Log activity
    await logActivity({
      type: "user_role_changed",
      userId: adminId,
      userName: "Admin",
      details: `Changed role to ${newRole} for user ${userId}`,
      metadata: { targetUserId: userId, newRole },
    });
  } catch (error) {
    console.error("Error changing user role:", error);
    throw error;
  }
}

/**
 * Suspend user
 */
export async function suspendUser(
  userId: string,
  reason: string,
  adminId: string,
  adminName: string,
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: "suspended",
      suspensionReason: reason,
      suspendedBy: adminId,
      suspendedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Log activity
    await logActivity({
      type: "user_suspended",
      userId: adminId,
      userName: adminName,
      details: `Suspended user ${userId}: ${reason}`,
      metadata: { targetUserId: userId, reason },
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    throw error;
  }
}

/**
 * Restore suspended user
 */
export async function restoreUser(
  userId: string,
  adminId: string,
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: "active",
      suspensionReason: null,
      suspendedBy: null,
      suspendedAt: null,
      updatedAt: Timestamp.now(),
    });

    // Log activity
    await logActivity({
      type: "user_role_changed",
      userId: adminId,
      userName: "Admin",
      details: `Restored user ${userId}`,
      metadata: { targetUserId: userId },
    });
  } catch (error) {
    console.error("Error restoring user:", error);
    throw error;
  }
}

/**
 * Delete user (soft delete)
 */
export async function deleteUser(userId: string, adminId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: "deleted",
      updatedAt: Timestamp.now(),
    });

    // Log activity
    await logActivity({
      type: "user_role_changed",
      userId: adminId,
      userName: "Admin",
      details: `Deleted user ${userId}`,
      metadata: { targetUserId: userId },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Get pending content for moderation
 */
export async function getPendingContent(): Promise<ContentModeration[]> {
  try {
    const pendingQuery = query(
      collection(db, "audiobooks"),
      where("status", "==", "pending"),
      orderBy("uploadedAt", "desc"),
    );

    const snapshot = await getDocs(pendingQuery);

    const content: ContentModeration[] = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const audiobook = { id: docSnap.id, ...data } as AudioBook;

        return {
          id: docSnap.id,
          audiobook,
          status: "pending",
          submittedBy: data.authorId || "",
          submittedByName: data.authorName || "Unknown",
          submittedAt: data.uploadedAt?.toDate() || new Date(),
          flagCount: 0,
          flags: [],
        };
      }),
    );

    return content;
  } catch (error) {
    console.error("Error fetching pending content:", error);
    throw error;
  }
}

/**
 * Approve content
 */
export async function approveContent(
  contentId: string,
  adminId: string,
  adminName: string,
): Promise<void> {
  try {
    const contentRef = doc(db, "audiobooks", contentId);
    await updateDoc(contentRef, {
      status: "approved",
      reviewedBy: adminId,
      reviewedByName: adminName,
      reviewedAt: Timestamp.now(),
    });

    // Log activity
    await logActivity({
      type: "book_approved",
      userId: adminId,
      userName: adminName,
      details: `Approved audiobook ${contentId}`,
      metadata: { contentId },
    });
  } catch (error) {
    console.error("Error approving content:", error);
    throw error;
  }
}

/**
 * Reject content
 */
export async function rejectContent(
  contentId: string,
  reason: string,
  adminId: string,
  adminName: string,
): Promise<void> {
  try {
    const contentRef = doc(db, "audiobooks", contentId);
    await updateDoc(contentRef, {
      status: "rejected",
      rejectionReason: reason,
      reviewedBy: adminId,
      reviewedByName: adminName,
      reviewedAt: Timestamp.now(),
    });

    // Log activity
    await logActivity({
      type: "book_rejected",
      userId: adminId,
      userName: adminName,
      details: `Rejected audiobook ${contentId}: ${reason}`,
      metadata: { contentId, reason },
    });
  } catch (error) {
    console.error("Error rejecting content:", error);
    throw error;
  }
}

/**
 * Get platform analytics
 */
export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const audiobooksSnap = await getDocs(collection(db, "audiobooks"));

    const totalUsers = usersSnap.size;
    const totalBooks = audiobooksSnap.size;

    // Calculate top books (mock data for now)
    const topBooks: BookMetric[] = audiobooksSnap.docs
      .slice(0, 10)
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Unknown",
          author: data.authorName || "Unknown",
          plays: data.playCount || 0,
          rating: data.rating || 0,
          completionRate: Math.random() * 100,
        };
      })
      .sort((a, b) => b.plays - a.plays);

    return {
      overview: {
        totalRevenue: 0,
        totalPlays: 0,
        totalListeningHours: 0,
        averageSessionDuration: 0,
        activeUsers: totalUsers,
        newUsers: 0,
        userGrowthRate: 0,
      },
      userMetrics: {
        dailyActiveUsers: 0,
        monthlyActiveUsers: totalUsers,
        userRetentionRate: 0,
        averageSessionsPerUser: 0,
      },
      contentMetrics: {
        totalBooks,
        booksPublishedThisMonth: 0,
        topGenres: [],
        topBooks,
      },
      timeSeriesData: [],
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}

/**
 * Log admin activity
 */
async function logActivity(
  activity: Omit<ActivityLog, "id" | "timestamp">,
): Promise<void> {
  try {
    const logsRef = collection(db, "activity_logs");
    await logsRef.add({
      ...activity,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw - logging failure shouldn't stop the main action
  }
}
