import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { AudioBook } from '@/types/audiobook';
import {
  PlaybackState,
  AudioPlayerContextType,
  SKIP_INTERVAL,
} from '@/types/playback';

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

const initialPlaybackState: PlaybackState = {
  currentBook: null,
  currentChapterIndex: 0,
  isPlaying: false,
  position: 0,
  duration: 0,
  playbackRate: 1.0,
  volume: 1.0,
  isSleepTimerActive: false,
  sleepTimerEndTime: null,
};

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(initialPlaybackState);
  const soundRef = useRef<Audio.Sound | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Configure audio session
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    };
    configureAudio();

    return () => {
      // Cleanup
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
    };
  }, []);

  // Update playback status
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaybackState((prev) => ({
        ...prev,
        isPlaying: status.isPlaying,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
      }));

      // Auto-advance to next chapter when current one finishes
      if (status.didJustFinish && !status.isLooping) {
        nextChapter();
      }
    }
  };

  const loadBook = async (book: AudioBook, chapterIndex: number = 0) => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // For demo purposes, we'll use a placeholder audio URL
      // In production, you'd load the actual chapter audio file
      const audioUrl = book.chapters[chapterIndex].audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;

      setPlaybackState((prev) => ({
        ...prev,
        currentBook: book,
        currentChapterIndex: chapterIndex,
        position: 0,
      }));
    } catch (error) {
      console.error('Error loading book:', error);
      throw error;
    }
  };

  const play = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Error playing:', error);
    }
  };

  const pause = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
    } catch (error) {
      console.error('Error pausing:', error);
    }
  };

  const togglePlayPause = async () => {
    if (playbackState.isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  const seekTo = async (position: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(position);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const skipForward = async (seconds: number = SKIP_INTERVAL) => {
    const newPosition = Math.min(
      playbackState.position + seconds * 1000,
      playbackState.duration
    );
    await seekTo(newPosition);
  };

  const skipBackward = async (seconds: number = SKIP_INTERVAL) => {
    const newPosition = Math.max(playbackState.position - seconds * 1000, 0);
    await seekTo(newPosition);
  };

  const nextChapter = async () => {
    if (!playbackState.currentBook) return;

    const nextIndex = playbackState.currentChapterIndex + 1;
    if (nextIndex < playbackState.currentBook.chapters.length) {
      const wasPlaying = playbackState.isPlaying;
      await loadBook(playbackState.currentBook, nextIndex);
      if (wasPlaying) {
        await play();
      }
    }
  };

  const previousChapter = async () => {
    if (!playbackState.currentBook) return;

    // If we're more than 3 seconds into the chapter, restart it
    if (playbackState.position > 3000) {
      await seekTo(0);
      return;
    }

    // Otherwise, go to previous chapter
    const prevIndex = playbackState.currentChapterIndex - 1;
    if (prevIndex >= 0) {
      const wasPlaying = playbackState.isPlaying;
      await loadBook(playbackState.currentBook, prevIndex);
      if (wasPlaying) {
        await play();
      }
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setRateAsync(rate, true);
        setPlaybackState((prev) => ({ ...prev, playbackRate: rate }));
      }
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setVolumeAsync(volume);
        setPlaybackState((prev) => ({ ...prev, volume }));
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const setSleepTimer = (minutes: number) => {
    // Clear existing timer
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
    }

    const endTime = Date.now() + minutes * 60 * 1000;

    sleepTimerRef.current = setTimeout(() => {
      pause();
      setPlaybackState((prev) => ({
        ...prev,
        isSleepTimerActive: false,
        sleepTimerEndTime: null,
      }));
    }, minutes * 60 * 1000);

    setPlaybackState((prev) => ({
      ...prev,
      isSleepTimerActive: true,
      sleepTimerEndTime: endTime,
    }));
  };

  const cancelSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    setPlaybackState((prev) => ({
      ...prev,
      isSleepTimerActive: false,
      sleepTimerEndTime: null,
    }));
  };

  const value: AudioPlayerContextType = {
    playbackState,
    loadBook,
    play,
    pause,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    nextChapter,
    previousChapter,
    setPlaybackRate,
    setVolume,
    setSleepTimer,
    cancelSleepTimer,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}
