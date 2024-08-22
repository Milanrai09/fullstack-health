// // import React, { useState, FormEvent } from 'react';
// // import { fetchChatGPTResponse } from '../hooks/apiHooks';



// // interface Message {
// //   role: 'system' | 'user' | 'assistant';
// //   content: string;
// // }


// const AiScreen : React.FC = () => {
//   // const [input, setInput] = useState<string>('');
//   // const [response, setResponse] = useState<string>('');
//   // const [messages, setMessages] = useState<Message[]>([
//   //   { role: 'system', content: 'You are a helpful assistant.' }
//   // ]);

//   // const handleSubmit = async (e: FormEvent) => {
//   //   e.preventDefault();
//   //   const userMessage: Message = { role: 'user', content: input };
//   //   const updatedMessages = [...messages, userMessage];
//   //   setMessages(updatedMessages);

//   //   try {
//   //     const chatGPTResponse = await fetchChatGPTResponse(updatedMessages);
//   //     setMessages([...updatedMessages, { role: 'assistant', content: chatGPTResponse }]);
//   //     setResponse(chatGPTResponse);
//   //     setInput('');
//   //   } catch (error) {
//   //     console.error('Error in handleSubmit:', error);
//   //   }
//   // };

//   return (
//     // <div>
//     //   <h1>Chat with OpenAI's GPT</h1>
//     //   <form onSubmit={handleSubmit}>
//     //     <input
//     //       type="text"
//     //       value={input}
//     //       onChange={(e) => setInput(e.target.value)}
//     //     />
//     //     <button type="submit">Send</button>
//     //   </form>
//     //   {response && (
//     //     <div>
//     //       <h2>Response:</h2>
//     //       <p>{response}</p>
//     //     </div>
//     //   )}
//     // </div>
//     <p>ai screen</p>
//   );
// };

// export default AiScreen


// src/Chat.tsx
import React, { useState, } from 'react';



const Chat: React.FC = () => {
  const [aiInput, setAiInput] = useState('');
  const [responseData, setResponseData] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/api/aiChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Fixed typo here
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: aiInput }] }), // Ensure it matches the expected backend format
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch ChatGPT response');
      }

      const data = await response.json();
      setResponseData(data.response); // Ensure you're accessing the correct field
    } catch (error) {
      console.error('Error fetching ChatGPT response:', error);
    }
  };

  return (
      <div className="ai-chat-container">
      <h1 className="ai-chat-title">AI Chat</h1>
      <div className="ai-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message here"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            required
            className="ai-input"
          />
          <button type="submit" className="ai-submit-btn">Search</button>
        </form>
      </div>
      <div className="response-display">
        <p className="response-text">Response: {responseData}</p>
      </div>
    </div>
  );
};

export default Chat;
