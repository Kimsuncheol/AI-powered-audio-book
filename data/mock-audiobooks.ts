import { AudioBook } from "@/types/audiobook";

// Using free audiobook samples from LibriVox and public domain sources
// Note: Replace these URLs with actual audio files when ready
export const MOCK_AUDIOBOOKS: AudioBook[] = [
  {
    id: "1",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    narrator: "LibriVox Community",
    coverImage: "https://covers.openlibrary.org/b/id/8235657-L.jpg",
    description:
      "A romantic novel of manners written by Jane Austen. The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of the British Regency.",
    duration: 43200, // 12 hours
    genre: ["Classic", "Romance", "Fiction"],
    rating: 4.8,
    publishYear: 1813,
    audioUrl:
      "https://www.archive.org/download/pride_prejudice_librivox/pride_prejudice_1_austen.mp3",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1",
        duration: 600,
        startTime: 0,
        audioUrl:
          "https://www.archive.org/download/pride_prejudice_librivox/pride_prejudice_1_austen.mp3",
      },
      {
        id: "ch2",
        title: "Chapter 2",
        duration: 720,
        startTime: 600,
      },
      {
        id: "ch3",
        title: "Chapter 3",
        duration: 840,
        startTime: 1320,
      },
      {
        id: "ch4",
        title: "Chapter 4",
        duration: 660,
        startTime: 2160,
      },
      {
        id: "ch5",
        title: "Chapter 5",
        duration: 540,
        startTime: 2820,
      },
    ],
  },
  {
    id: "2",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    narrator: "Frank Marcopolos",
    coverImage: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    description:
      "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    duration: 18000, // 5 hours
    genre: ["Classic", "Fiction", "American Literature"],
    rating: 4.7,
    publishYear: 1925,
    audioUrl:
      "https://www.archive.org/download/great_gatsby_librivox/gatsby_01_fitzgerald.mp3",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1",
        duration: 1800,
        startTime: 0,
      },
      {
        id: "ch2",
        title: "Chapter 2",
        duration: 1920,
        startTime: 1800,
      },
      {
        id: "ch3",
        title: "Chapter 3",
        duration: 2100,
        startTime: 3720,
      },
      {
        id: "ch4",
        title: "Chapter 4",
        duration: 1680,
        startTime: 5820,
      },
    ],
  },
  {
    id: "3",
    title: "Frankenstein",
    author: "Mary Shelley",
    narrator: "Kristin Luoma",
    coverImage: "https://covers.openlibrary.org/b/id/8229148-L.jpg",
    description:
      "Frankenstein tells the story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment. The novel has had a considerable influence on literature and popular culture and spawned a complete genre of horror stories.",
    duration: 28800, // 8 hours
    genre: ["Classic", "Horror", "Science Fiction"],
    rating: 4.6,
    publishYear: 1818,
    audioUrl:
      "https://www.archive.org/download/frankenstein_librivox/frankenstein_01_shelley.mp3",
    chapters: [
      {
        id: "ch1",
        title: "Letter 1",
        duration: 600,
        startTime: 0,
      },
      {
        id: "ch2",
        title: "Letter 2",
        duration: 480,
        startTime: 600,
      },
      {
        id: "ch3",
        title: "Letter 3",
        duration: 540,
        startTime: 1080,
      },
      {
        id: "ch4",
        title: "Letter 4",
        duration: 720,
        startTime: 1620,
      },
      {
        id: "ch5",
        title: "Chapter 1",
        duration: 900,
        startTime: 2340,
      },
    ],
  },
  {
    id: "4",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    narrator: "Kara Shallenberg",
    coverImage: "https://covers.openlibrary.org/b/id/8235640-L.jpg",
    description:
      "Alice's Adventures in Wonderland is a novel about a girl named Alice who falls through a rabbit hole into a fantasy world of anthropomorphic creatures. It is seen as an example of the literary nonsense genre.",
    duration: 10800, // 3 hours
    genre: ["Classic", "Fantasy", "Children's Literature"],
    rating: 4.9,
    publishYear: 1865,
    audioUrl:
      "https://www.archive.org/download/alices_adventures_librivox/alice_01_carroll.mp3",
    chapters: [
      {
        id: "ch1",
        title: "Down the Rabbit Hole",
        duration: 900,
        startTime: 0,
      },
      {
        id: "ch2",
        title: "The Pool of Tears",
        duration: 780,
        startTime: 900,
      },
      {
        id: "ch3",
        title: "A Caucus-Race and a Long Tale",
        duration: 720,
        startTime: 1680,
      },
      {
        id: "ch4",
        title: "The Rabbit Sends in a Little Bill",
        duration: 840,
        startTime: 2400,
      },
    ],
  },
  {
    id: "5",
    title: "Dracula",
    author: "Bram Stoker",
    narrator: "LibriVox Volunteers",
    coverImage: "https://covers.openlibrary.org/b/id/8235841-L.jpg",
    description:
      "Dracula is an 1897 Gothic horror novel. The novel tells the story of Dracula's attempt to move from Transylvania to England so that he may find new blood and spread the undead curse, and of the battle between Dracula and a small group of people led by Professor Abraham Van Helsing.",
    duration: 57600, // 16 hours
    genre: ["Classic", "Horror", "Gothic"],
    rating: 4.7,
    publishYear: 1897,
    audioUrl:
      "https://www.archive.org/download/dracula_librivox/dracula_01_stoker.mp3",
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1: Jonathan Harker's Journal",
        duration: 1800,
        startTime: 0,
      },
      {
        id: "ch2",
        title: "Chapter 2: Jonathan Harker's Journal (continued)",
        duration: 1920,
        startTime: 1800,
      },
      {
        id: "ch3",
        title: "Chapter 3: Jonathan Harker's Journal (continued)",
        duration: 2040,
        startTime: 3720,
      },
    ],
  },
  {
    id: "6",
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    narrator: "David Clarke",
    coverImage: "https://covers.openlibrary.org/b/id/8231692-L.jpg",
    description:
      'A collection of twelve short stories featuring Sherlock Holmes, first published in 1892. These are the first set of Holmes stories, including classics like "A Scandal in Bohemia" and "The Red-Headed League".',
    duration: 32400, // 9 hours
    genre: ["Classic", "Mystery", "Detective"],
    rating: 4.8,
    publishYear: 1892,
    audioUrl:
      "https://www.archive.org/download/adventures_sherlock_holmes_librivox/adventures_01_doyle.mp3",
    chapters: [
      {
        id: "ch1",
        title: "A Scandal in Bohemia",
        duration: 2700,
        startTime: 0,
      },
      {
        id: "ch2",
        title: "The Red-Headed League",
        duration: 2880,
        startTime: 2700,
      },
      {
        id: "ch3",
        title: "A Case of Identity",
        duration: 2400,
        startTime: 5580,
      },
    ],
  },
];

// Helper function to format duration for book metadata (hours/minutes)
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Helper function to format playback time (m:ss)
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  // Format as m:ss (e.g., "5:03" or "125:47")
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to get progress percentage
export function getProgressPercentage(
  currentPosition: number,
  totalDuration: number,
): number {
  return Math.min(100, (currentPosition / totalDuration) * 100);
}
