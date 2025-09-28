import React, { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useTheme } from '../ThemeContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Olá! Como posso te ajudar hoje?' }
  ]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSendMessage = async (userInput) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userInput },
    ]);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const botResponse = `Você disse: "${userInput}". Esta é uma resposta simulada.`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botResponse },
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

  // Defina as classes de acordo com o tema
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