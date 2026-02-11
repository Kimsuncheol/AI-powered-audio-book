import { useAuth } from "@/context/auth-context";
import { useSilentModeCheck } from "@/hooks/use-silent-mode-check";
import { AudioBook } from "@/types/audiobook";
import {
  AudioPlayerContextType,
  GUEST_CHAPTER_LIMIT,
  GUEST_TIME_LIMIT,
  PlaybackState,
  SKIP_INTERVAL,
} from "@/types/playback";
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from "expo-audio";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
);

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

interface AudioPlayerProviderProps {
  children: React.ReactNode;
  onPreviewLimitReached?: (reason: "time" | "chapter") => void;
}

export function AudioPlayerProvider({
  children,
  onPreviewLimitReached,
}: AudioPlayerProviderProps) {
  const [playbackState, setPlaybackState] =
    useState<PlaybackState>(initialPlaybackState);
  const playerRef = useRef<AudioPlayer | null>(null);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isGuest } = useAuth();
  const { checkAndAlert, isSilent } = useSilentModeCheck();
  const previousSilentStateRef = useRef<boolean>(false);

  // Configure audio session
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          shouldPlayInBackground: true,
          playsInSilentMode: true,
          interruptionMode: "duckOthers",
        });
      } catch (error) {
        console.error("Error configuring audio:", error);
      }
    };
    configureAudio();

    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current.remove();
      }
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, []);

  // Monitor volume changes during playback
  useEffect(() => {
    // Only show alert if volume becomes 0 while playing
    if (playbackState.isPlaying && isSilent && !previousSilentStateRef.current) {
      // Volume just became 0 or device entered silent mode during playback
      // Pause immediately to avoid playing with no audio
      if (playerRef.current) {
        playerRef.current.pause();
      }

      // Show alert and give option to continue
      checkAndAlert(() => {
        if (playerRef.current) {
          playerRef.current.play();
        }
      });
    }
    // Update previous state
    previousSilentStateRef.current = isSilent;
  }, [isSilent, playbackState.isPlaying, checkAndAlert]);

  // Start polling for playback status updates
  const startStatusPolling = () => {
    // Clear any existing interval
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }

    statusIntervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      setPlaybackState((prev) => ({
        ...prev,
        isPlaying: player.playing,
        position: player.currentTime,
        duration: player.duration,
      }));

      // Guest mode preview limits
      if (isGuest && playerRef.current?.playing) {
        if (player.currentTime > GUEST_TIME_LIMIT) {
          pause();
          onPreviewLimitReached?.("time");
        }
      }
    }, 500);
  };

  const stopStatusPolling = () => {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
  };

  /**
   * Safely stops and unloads any currently active audio
   *
   * This function performs the following checks and operations:
   * 1. Checks if there's an active audio player
   * 2. Stops status polling to prevent memory leaks
   * 3. Pauses playback if audio is currently playing
   * 4. Removes all event listeners
   * 5. Unloads and removes the audio player
   * 6. Clears player reference and resets state
   *
   * This ensures no audio is playing before starting a new track
   * and prevents issues like:
   * - Multiple audio tracks playing simultaneously
   * - Memory leaks from unremoved listeners
   * - Corrupted playback state
   *
   * @returns Promise that resolves when audio is safely stopped and unloaded
   */
  const stopAndUnloadCurrentAudio = async (): Promise<void> => {
    try {
      const player = playerRef.current;

      // Check if there's an active audio player
      if (!player) {
        return; // No audio to stop
      }

      console.log("Stopping and unloading current audio...");

      // Stop status polling first
      stopStatusPolling();

      // Check if audio is currently playing and stop it
      if (player.playing) {
        console.log("Audio is playing - pausing...");
        player.pause();
      }

      // Remove all event listeners to prevent memory leaks
      player.removeAllListeners();

      // Unload and remove the player
      player.remove();

      // Clear the player reference
      playerRef.current = null;

      // Reset playback state (but keep book info for UI)
      setPlaybackState((prev) => ({
        ...prev,
        isPlaying: false,
        position: 0,
      }));

      console.log("Audio successfully stopped and unloaded");
    } catch (error) {
      console.error("Error stopping and unloading audio:", error);
      // Force cleanup even if there's an error
      playerRef.current = null;
      stopStatusPolling();
    }
  };

  const loadBook = async (book: AudioBook, chapterIndex: number = 0) => {
    try {
      // Stop and unload any currently playing audio before loading new track
      await stopAndUnloadCurrentAudio();

      // Get the audio URL for the chapter
      const audioUrl =
        book.chapters[chapterIndex].audioUrl ||
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

      // Create new audio player
      const player = createAudioPlayer({ uri: audioUrl });
      playerRef.current = player;

      // Listen for playback status updates to detect end of track
      player.addListener("playbackStatusUpdate", (status) => {
        if (status.didJustFinish) {
          nextChapter();
        }
      });

      setPlaybackState((prev) => ({
        ...prev,
        currentBook: book,
        currentChapterIndex: chapterIndex,
        position: 0,
      }));

      // Start polling for status updates
      startStatusPolling();
    } catch (error) {
      console.error("Error loading book:", error);
      throw error;
    }
  };

  const play = async () => {
    try {
      if (playerRef.current) {
        playerRef.current.play();
      }
    } catch (error) {
      console.error("Error playing:", error);
    }
  };

  const pause = async () => {
    try {
      if (playerRef.current) {
        playerRef.current.pause();
      }
    } catch (error) {
      console.error("Error pausing:", error);
    }
  };

  const togglePlayPause = async () => {
    if (playbackState.isPlaying) {
      pause();
    } else {
      // Check silent mode before playing
      checkAndAlert(() => {
        play();
      });
    }
  };

  const seekTo = async (position: number) => {
    try {
      if (playerRef.current) {
        await playerRef.current.seekTo(position);
      }
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  const skipForward = async (seconds: number = SKIP_INTERVAL) => {
    const newPosition = Math.min(
      playbackState.position + seconds,
      playbackState.duration,
    );
    await seekTo(newPosition);
  };

  const skipBackward = async (seconds: number = SKIP_INTERVAL) => {
    const newPosition = Math.max(playbackState.position - seconds, 0);
    await seekTo(newPosition);
  };

  const stopPlayback = async () => {
    try {
      // Use the safe stop and unload function
      await stopAndUnloadCurrentAudio();
      // Reset all playback state to initial values
      setPlaybackState(initialPlaybackState);
    } catch (error) {
      console.error("Error stopping playback:", error);
    }
  };

  const nextChapter = async () => {
    if (!playbackState.currentBook) return;

    const nextIndex = playbackState.currentChapterIndex + 1;

    // Guest mode: prevent access to chapters beyond the first one
    if (isGuest && nextIndex > GUEST_CHAPTER_LIMIT) {
      pause();
      onPreviewLimitReached?.("chapter");
      return;
    }

    if (nextIndex < playbackState.currentBook.chapters.length) {
      const wasPlaying = playbackState.isPlaying;
      await loadBook(playbackState.currentBook, nextIndex);
      if (wasPlaying) {
        play();
      }
    }
  };

  const previousChapter = async () => {
    if (!playbackState.currentBook) return;

    // If we're more than 3 seconds into the chapter, restart it
    if (playbackState.position > 3) {
      await seekTo(0);
      return;
    }

    // Otherwise, go to previous chapter
    const prevIndex = playbackState.currentChapterIndex - 1;
    if (prevIndex >= 0) {
      const wasPlaying = playbackState.isPlaying;
      await loadBook(playbackState.currentBook, prevIndex);
      if (wasPlaying) {
        play();
      }
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      if (playerRef.current) {
        playerRef.current.setPlaybackRate(rate);
        setPlaybackState((prev) => ({ ...prev, playbackRate: rate }));
      }
    } catch (error) {
      console.error("Error setting playback rate:", error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      if (playerRef.current) {
        playerRef.current.volume = volume;
        setPlaybackState((prev) => ({ ...prev, volume }));
      }
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  };

  const setSleepTimer = (minutes: number) => {
    // Clear existing timer
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
    }

    const endTime = Date.now() + minutes * 60 * 1000;

    sleepTimerRef.current = setTimeout(
      () => {
        pause();
        setPlaybackState((prev) => ({
          ...prev,
          isSleepTimerActive: false,
          sleepTimerEndTime: null,
        }));
      },
      minutes * 60 * 1000,
    );

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
    stopPlayback,
    onPreviewLimitReached,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider",
    );
  }
  return context;
}
