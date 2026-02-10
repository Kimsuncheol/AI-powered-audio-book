import { AudioBook } from "./audiobook";

export interface PlaybackState {
  currentBook: AudioBook | null;
  currentChapterIndex: number;
  isPlaying: boolean;
  position: number; // in seconds
  duration: number; // in seconds
  playbackRate: number;
  volume: number;
  isSleepTimerActive: boolean;
  sleepTimerEndTime: number | null;
}

export interface AudioPlayerContextType {
  playbackState: PlaybackState;
  loadBook: (book: AudioBook, chapterIndex?: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  skipForward: (seconds?: number) => Promise<void>;
  skipBackward: (seconds?: number) => Promise<void>;
  nextChapter: () => Promise<void>;
  previousChapter: () => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
  stopPlayback: () => Promise<void>;
  onPreviewLimitReached?: (reason: "time" | "chapter") => void;
}

export const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
export const SKIP_INTERVAL = 15; // seconds

// Guest mode preview limits
export const GUEST_TIME_LIMIT = 5 * 60; // 5 minutes in seconds
export const GUEST_CHAPTER_LIMIT = 0; // Only first chapter (index 0)
