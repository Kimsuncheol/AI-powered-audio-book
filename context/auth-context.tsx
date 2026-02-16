import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/config/firebase';
import { UserProfile } from '@/types/user';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
  exitGuestMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_MODE_KEY = '@auth:guestMode';

function normalizeDate(value: unknown): Date {
  if (value instanceof Date) return value;

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function normalizeUserProfile(rawData: unknown, user: User): UserProfile {
  const data =
    typeof rawData === 'object' && rawData !== null
      ? (rawData as Record<string, unknown>)
      : {};

  return {
    uid: user.uid,
    email: typeof data.email === 'string' ? data.email : user.email || '',
    displayName:
      typeof data.displayName === 'string'
        ? data.displayName
        : user.displayName || '',
    role: 'user',
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt),
    photoURL: typeof data.photoURL === 'string' ? data.photoURL : undefined,
    bio: typeof data.bio === 'string' ? data.bio : undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Clear guest mode when user signs in
        setIsGuest(false);
        await AsyncStorage.removeItem(GUEST_MODE_KEY);

        // Load user profile from Firestore
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          setUserProfile(normalizeUserProfile(profileDoc.data(), user));
        } else {
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        // No user logged in - automatically set guest mode
        setUserProfile(null);
        setIsGuest(true);
        await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Create user profile in Firestore
    const profile: UserProfile = {
      uid: userCredential.user.uid,
      email,
      displayName,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), profile);

    setUser(userCredential.user);
    setUserProfile(profile);

    // Clear guest mode when signing up
    setIsGuest(false);
    await AsyncStorage.removeItem(GUEST_MODE_KEY);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // Guest mode is cleared in onAuthStateChanged
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
    // Automatically return to guest mode after sign out
    setIsGuest(true);
    await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
  };

  const enterGuestMode = async () => {
    setIsGuest(true);
    await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
  };

  const exitGuestMode = async () => {
    setIsGuest(false);
    await AsyncStorage.removeItem(GUEST_MODE_KEY);
  };

  const value = {
    user,
    userProfile,
    loading,
    isGuest,
    signUp,
    signIn,
    signOut,
    enterGuestMode,
    exitGuestMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
