import OpenAI from 'openai';

// TODO: Add your OpenAI API key here or use environment variables
// Get your API key from: https://platform.openai.com/api-keys
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  // For React Native, you might need to use a proxy or handle CORS
  dangerouslyAllowBrowser: true, // Only for development
});

// Check if API key is configured
export const isOpenAIConfigured = () => {
  return OPENAI_API_KEY && OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE';
};
