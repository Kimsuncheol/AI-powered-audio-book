import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './auth-context';

const FAVORITES_KEY = '@favorites:';

interface FavoritesContextType {
  favorites: string[]; // Array of book IDs
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (bookId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from storage
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY + user.uid);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };
    loadFavorites();
  }, [user]);

  // Save favorites to storage
  const saveFavorites = async (newFavorites: string[]) => {
    if (!user) return;
    try {
      await AsyncStorage.setItem(FAVORITES_KEY + user.uid, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const isFavorite = (bookId: string) => favorites.includes(bookId);

  const toggleFavorite = (bookId: string) => {
    const newFavorites = isFavorite(bookId)
      ? favorites.filter((id) => id !== bookId)
      : [...favorites, bookId];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
