// src/apiHooks.ts
interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  export const fetchChatGPTResponse = async (messages: Message[]): Promise<string> => {
    try {
      const response = await fetch(`${https://fullstack-health-backend.vercel.app}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch ChatGPT response');
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching ChatGPT response:', error);
      throw error;
    }
  };
  
