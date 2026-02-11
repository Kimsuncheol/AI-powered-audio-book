import { AudioBook } from "./audiobook";
import { UserProfile } from "./user";

// Admin Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalAuthors: number;
  totalAdmins: number;
  totalAudiobooks: number;
  pendingContent: number;
  activeListeners: number;
  totalPlaytime: number; // in hours
  recentActivity: ActivityLog[];
}

// Activity Log
export interface ActivityLog {
  id: string;
  type: "user_registered" | "book_uploaded" | "book_approved" | "book_rejected" | "user_role_changed" | "user_suspended";
  timestamp: Date;
  userId: string;
  userName: string;
  details: string;
  metadata?: Record<string, any>;
}

// Content Moderation
export interface ContentModeration {
  id: string;
  audiobook: AudioBook;
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  submittedByName: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  flagCount: number;
  flags: ContentFlag[];
}

export interface ContentFlag {
  id: string;
  reportedBy: string;
  reportedByName: string;
  reason: "inappropriate" | "copyright" | "spam" | "quality" | "other";
  description: string;
  timestamp: Date;
}

// User Management
export interface UserManagement extends UserProfile {
  status: "active" | "suspended" | "deleted";
  lastActive?: Date;
  audiobooksListened: number;
  audiobooksAuthored?: number;
  joinedAt: Date;
  suspensionReason?: string;
  suspendedBy?: string;
  suspendedAt?: Date;
}

// Analytics Data
export interface PlatformAnalytics {
  overview: {
    totalRevenue: number;
    totalPlays: number;
    totalListeningHours: number;
    averageSessionDuration: number;
    activeUsers: number;
    newUsers: number;
    userGrowthRate: number;
  };
  userMetrics: {
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    userRetentionRate: number;
    averageSessionsPerUser: number;
  };
  contentMetrics: {
    totalBooks: number;
    booksPublishedThisMonth: number;
    topGenres: GenreMetric[];
    topBooks: BookMetric[];
  };
  timeSeriesData: {
    date: string;
    users: number;
    plays: number;
    newBooks: number;
  }[];
}

export interface GenreMetric {
  genre: string;
  count: number;
  percentage: number;
}

export interface BookMetric {
  id: string;
  title: string;
  author: string;
  plays: number;
  rating: number;
  completionRate: number;
}

// Admin Actions
export type AdminAction =
  | { type: "change_role"; userId: string; newRole: "user" | "author" | "admin" }
  | { type: "suspend_user"; userId: string; reason: string }
  | { type: "restore_user"; userId: string }
  | { type: "delete_user"; userId: string; permanent: boolean }
  | { type: "approve_content"; contentId: string }
  | { type: "reject_content"; contentId: string; reason: string }
  | { type: "delete_content"; contentId: string }
  | { type: "flag_content"; contentId: string; reason: string };
