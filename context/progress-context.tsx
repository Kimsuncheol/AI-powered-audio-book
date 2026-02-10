import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './auth-context';
import { UserProgress } from '@/types/audiobook';

const PROGRESS_KEY = '@progress:';

interface ProgressContextType {
  progressMap: Record<string, UserProgress>;
  getProgress: (bookId: string) => UserProgress | undefined;
  updateProgress: (bookId: string, position: number, chapter: number) => void;
  markCompleted: (bookId: string) => void;
  getInProgressBooks: () => UserProgress[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setProgressMap({});
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(PROGRESS_KEY + user.uid);
        if (stored) {
          setProgressMap(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    };
    loadProgress();
  }, [user]);

  const saveProgress = async (newProgress: Record<string, UserProgress>) => {
    if (!user) return;
    try {
      await AsyncStorage.setItem(PROGRESS_KEY + user.uid, JSON.stringify(newProgress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const getProgress = (bookId: string) => progressMap[bookId];

  const updateProgress = (bookId: string, position: number, chapter: number) => {
    const newProgress = {
      ...progressMap,
      [bookId]: {
        bookId,
        currentPosition: position,
        currentChapter: chapter,
        lastPlayed: new Date(),
        completed: false,
      },
    };
    setProgressMap(newProgress);
    saveProgress(newProgress);
  };

  const markCompleted = (bookId: string) => {
    const existing = progressMap[bookId];
    if (existing) {
      const newProgress = {
        ...progressMap,
        [bookId]: { ...existing, completed: true },
      };
      setProgressMap(newProgress);
      saveProgress(newProgress);
    }
  };

  const getInProgressBooks = () => {
    return Object.values(progressMap)
      .filter((p) => !p.completed && p.currentPosition > 0)
      .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime());
  };

  return (
    <ProgressContext.Provider value={{ progressMap, getProgress, updateProgress, markCompleted, getInProgressBooks }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
