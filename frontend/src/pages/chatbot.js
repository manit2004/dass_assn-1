import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setMessages(storedMessages);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    // Create a new message object
    const newMessage = { role: 'user', content: input };

    // Update local state with user message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await axios.post('http://localhost:5001/chat', {
        message: input,
        messages: [...messages, newMessage], // Send all messages including the new one
      });

      // Append the response message to the local state
      const botResponse = response.data.reply;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: botResponse },
      ]);

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewSession = async () => {
    try {
      await axios.post('http://localhost:5001/new-session');
      setMessages([]); // Clear local state
      localStorage.removeItem('messages'); // Clear localStorage
    } catch (error) {
      console.error('Error starting new session:', error);
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <div
        id="chatDisplay"
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          width: '300px',
          height: '400px',
          overflowY: 'auto',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        style={{ width: '300px' }}
      />
      <button onClick={sendMessage}>Send Message</button>
      <button onClick={startNewSession}>Start New Session</button>
    </div>
  );
}

export default Chatbot;
