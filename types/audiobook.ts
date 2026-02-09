export interface Chapter {
  id: string;
  title: string;
  duration: number; // in seconds
  startTime: number; // in seconds
  audioUrl?: string;
}

export interface AudioBook {
  id: string;
  title: string;
  author: string;
  narrator: string;
  coverImage: string;
  description: string;
  duration: number; // total duration in seconds
  chapters: Chapter[];
  genre: string[];
  rating: number;
  publishYear: number;
  audioUrl: string; // URL to the full audiobook file
}

export interface UserProgress {
  bookId: string;
  currentPosition: number; // in seconds
  currentChapter: number;
  lastPlayed: Date;
  completed: boolean;
}

export interface Bookmark {
  id: string;
  bookId: string;
  position: number; // in seconds
  note?: string;
  createdAt: Date;
}
