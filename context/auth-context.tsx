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
import { UserRole, UserProfile } from '@/types/user';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
  exitGuestMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_MODE_KEY = '@auth:guestMode';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Load guest mode state from AsyncStorage
    const loadGuestMode = async () => {
      try {
        const guestMode = await AsyncStorage.getItem(GUEST_MODE_KEY);
        setIsGuest(guestMode === 'true');
      } catch (error) {
        console.error('Failed to load guest mode:', error);
      }
    };

    loadGuestMode();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Clear guest mode when user signs in
        setIsGuest(false);
        await AsyncStorage.removeItem(GUEST_MODE_KEY);

        // Load user profile from Firestore
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Create user profile in Firestore
    const profile: UserProfile = {
      uid: userCredential.user.uid,
      email,
      displayName,
      role,
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
    // Don't auto-enter guest mode on sign out
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
