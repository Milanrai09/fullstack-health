// src/openaiService.ts
import fetch from 'node-fetch';

const apiKey = process.env.OPENAI_API_KEY;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: Message;
  }[];
  error?: {
    message: string;
  };
}

function isOpenAIResponse(data: unknown): data is OpenAIResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'choices' in data &&
    Array.isArray(data.choices) &&
    data.choices.every((choice) => 'message' in choice)
  );
}

export const fetchChatGPTResponse = async (messages: Message[]): Promise<string> => {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    }),
  });

  const data: unknown = await response.json();

  if (!isOpenAIResponse(data)) {
    throw new Error('Invalid response data');
  }

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch ChatGPT response');
  }

  return data.choices[0].message.content;
};