import React, { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useTheme } from '../ThemeContext';
import { fetchGroqResponse } from '../groqApi';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Olá! Como posso te ajudar hoje?' }
  ]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSendMessage = async (userInput) => {
  const userMessage = { sender: 'user', text: userInput };

  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setLoading(true);

  try {
    const groqMessages = updatedMessages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const aiText = await fetchGroqResponse(groqMessages);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: aiText },
    ]);
  } catch (error) {
    console.error("Erro ao buscar resposta do bot:", error);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: "Desculpe, algo deu errado." },
    ]);
  } finally {
    setLoading(false);
  }
};

  const bgClass =
    theme === 'dark'
      ? 'bg-[#232324]'
      : 'bg-white';

  return (
    <div className={`flex flex-col w-full h-full ${bgClass} transition-colors`}>
      <ChatMessages messages={messages} loading={loading} theme={theme} />
      <ChatInput onSendMessage={handleSendMessage} theme={theme} />
    </div>
  );
};

export default Chatbot;