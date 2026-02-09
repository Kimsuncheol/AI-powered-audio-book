import { openai, isOpenAIConfigured } from '@/config/openai';
import { AudioBook } from '@/types/audiobook';

export interface BookSummary {
  shortSummary: string; // 2-3 sentences
  detailedSummary: string; // Several paragraphs
  keyThemes: string[];
  mainCharacters?: string[];
  generatedAt: Date;
}

export interface ChapterInsight {
  chapterId: string;
  keyPoints: string[];
  summary: string;
  quotes?: string[];
}

export interface BookRecommendation {
  bookId: string;
  reason: string;
  similarity: number;
}

class AIService {
  /**
   * Generate an AI-powered summary of a book
   */
  async generateBookSummary(book: AudioBook): Promise<BookSummary> {
    if (!isOpenAIConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const prompt = `Analyze the book "${book.title}" by ${book.author}.

Book Description: ${book.description}

Please provide:
1. A short summary (2-3 sentences)
2. A detailed summary (3-4 paragraphs covering the main plot, themes, and significance)
3. Key themes (3-5 main themes)
4. Main characters (if applicable)

Format your response as JSON with keys: shortSummary, detailedSummary, keyThemes (array), mainCharacters (array)`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a literary expert who provides insightful book summaries and analysis. Always respond with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content);

      return {
        shortSummary: parsed.shortSummary,
        detailedSummary: parsed.detailedSummary,
        keyThemes: parsed.keyThemes || [],
        mainCharacters: parsed.mainCharacters || [],
        generatedAt: new Date(),
      };
    } catch (error: any) {
      console.error('Error generating book summary:', error);
      throw new Error(error.message || 'Failed to generate book summary');
    }
  }

  /**
   * Generate insights for a specific chapter
   */
  async generateChapterInsight(
    book: AudioBook,
    chapterIndex: number
  ): Promise<ChapterInsight> {
    if (!isOpenAIConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    const chapter = book.chapters[chapterIndex];
    if (!chapter) {
      throw new Error('Chapter not found');
    }

    try {
      const prompt = `Analyze Chapter ${chapterIndex + 1} of "${book.title}" by ${book.author}.

Chapter Title: ${chapter.title}
Book Context: ${book.description}

Please provide:
1. Key points from this chapter (3-5 bullet points)
2. A brief summary of what happens in this chapter (2-3 sentences)
3. Notable quotes or memorable moments (if applicable)

Format your response as JSON with keys: keyPoints (array), summary (string), quotes (array)`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a literary expert who provides insightful chapter analysis. Always respond with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content);

      return {
        chapterId: chapter.id,
        keyPoints: parsed.keyPoints || [],
        summary: parsed.summary,
        quotes: parsed.quotes || [],
      };
    } catch (error: any) {
      console.error('Error generating chapter insight:', error);
      throw new Error(error.message || 'Failed to generate chapter insight');
    }
  }

  /**
   * Get personalized book recommendations based on a book
   */
  async getRecommendations(
    currentBook: AudioBook,
    allBooks: AudioBook[]
  ): Promise<BookRecommendation[]> {
    if (!isOpenAIConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const otherBooks = allBooks
        .filter((b) => b.id !== currentBook.id)
        .map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          genre: b.genre,
          description: b.description.substring(0, 200),
        }));

      const prompt = `A user just finished reading "${currentBook.title}" by ${currentBook.author}.

Book details:
- Genres: ${currentBook.genre.join(', ')}
- Description: ${currentBook.description}

Available books to recommend from:
${JSON.stringify(otherBooks, null, 2)}

Based on the user's reading preferences, recommend the top 3 books from the available list.
For each recommendation, explain why it's a good match and rate the similarity (0-100).

Format as JSON with array of objects: bookId, reason (string), similarity (number)`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a book recommendation expert. Provide thoughtful recommendations based on genre, themes, and writing style. Always respond with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content);
      return parsed.recommendations || [];
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      throw new Error(error.message || 'Failed to get recommendations');
    }
  }

  /**
   * Get personalized book recommendations based on user's listening history
   */
  async getPersonalizedRecommendations(
    userGenrePreferences: string[],
    allBooks: AudioBook[]
  ): Promise<AudioBook[]> {
    if (!isOpenAIConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const booksInfo = allBooks.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        genre: b.genre,
        rating: b.rating,
        description: b.description.substring(0, 150),
      }));

      const prompt = `A user's favorite genres are: ${userGenrePreferences.join(', ')}

Available books:
${JSON.stringify(booksInfo, null, 2)}

Recommend the top 4 books that best match the user's preferences.
Consider genre, ratings, and themes.

Return an array of book IDs in order of recommendation strength.
Format as JSON: { "bookIds": ["id1", "id2", "id3", "id4"] }`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a book recommendation expert. Always respond with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content);
      const recommendedIds = parsed.bookIds || [];

      return allBooks.filter((book) => recommendedIds.includes(book.id));
    } catch (error: any) {
      console.error('Error getting personalized recommendations:', error);
      throw new Error(error.message || 'Failed to get recommendations');
    }
  }
}

export const aiService = new AIService();
