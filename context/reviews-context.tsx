import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './auth-context';

const REVIEWS_KEY = '@reviews';

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

interface ReviewsContextType {
  getReviewsForBook: (bookId: string) => Review[];
  getAverageRating: (bookId: string) => { average: number; count: number };
  addReview: (bookId: string, rating: number, text: string) => void;
  hasUserReviewed: (bookId: string) => boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// Seed some initial reviews
const SEED_REVIEWS: Review[] = [
  {
    id: 'r1',
    bookId: '1',
    userId: 'seed1',
    userName: 'Sarah Johnson',
    rating: 5,
    text: "Absolutely captivating! The narrator brings the story to life beautifully. Couldn't stop listening.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'r2',
    bookId: '1',
    userId: 'seed2',
    userName: 'Michael Chen',
    rating: 4,
    text: 'Great story and excellent narration. Highly recommend for anyone who enjoys classic literature.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'r3',
    bookId: '2',
    userId: 'seed1',
    userName: 'Sarah Johnson',
    rating: 5,
    text: 'A timeless masterpiece. The audiobook format adds a new dimension to this classic.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'r4',
    bookId: '4',
    userId: 'seed3',
    userName: 'Emily Davis',
    rating: 5,
    text: 'Perfect narration for a whimsical story. My kids loved it too!',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const stored = await AsyncStorage.getItem(REVIEWS_KEY);
        if (stored) {
          const userReviews: Review[] = JSON.parse(stored);
          // Merge seed reviews with user reviews (avoiding duplicates)
          const seedIds = SEED_REVIEWS.map((r) => r.id);
          const uniqueUserReviews = userReviews.filter((r) => !seedIds.includes(r.id));
          setReviews([...SEED_REVIEWS, ...uniqueUserReviews]);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    };
    loadReviews();
  }, []);

  const saveReviews = async (allReviews: Review[]) => {
    try {
      // Only save user-created reviews (not seeds)
      const seedIds = SEED_REVIEWS.map((r) => r.id);
      const userReviews = allReviews.filter((r) => !seedIds.includes(r.id));
      await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(userReviews));
    } catch (error) {
      console.error('Failed to save reviews:', error);
    }
  };

  const getReviewsForBook = (bookId: string) => {
    return reviews
      .filter((r) => r.bookId === bookId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getAverageRating = (bookId: string) => {
    const bookReviews = reviews.filter((r) => r.bookId === bookId);
    if (bookReviews.length === 0) return { average: 0, count: 0 };
    const sum = bookReviews.reduce((acc, r) => acc + r.rating, 0);
    return { average: parseFloat((sum / bookReviews.length).toFixed(1)), count: bookReviews.length };
  };

  const addReview = (bookId: string, rating: number, text: string) => {
    if (!user) return;
    const newReview: Review = {
      id: `review_${Date.now()}`,
      bookId,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      rating,
      text,
      createdAt: new Date().toISOString(),
    };
    const newReviews = [...reviews, newReview];
    setReviews(newReviews);
    saveReviews(newReviews);
  };

  const hasUserReviewed = (bookId: string) => {
    if (!user) return false;
    return reviews.some((r) => r.bookId === bookId && r.userId === user.uid);
  };

  return (
    <ReviewsContext.Provider value={{ getReviewsForBook, getAverageRating, addReview, hasUserReviewed }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}
