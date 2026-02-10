export type UserRole = 'user' | 'author' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  photoURL?: string;
  bio?: string;
}

export interface AuthorProfile extends UserProfile {
  role: 'author';
  authorBio?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    instagram?: string;
  };
  publishedBooks: string[]; // Array of book IDs
}

export interface AdminProfile extends UserProfile {
  role: 'admin';
  permissions: string[];
}
