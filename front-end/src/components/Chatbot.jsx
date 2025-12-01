import React, { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useTheme } from '../ThemeContext';
import { sendChatMessage } from '../api';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Olá! Bem-vindo ao Guia UTFPR Apucarana! 🎓 Estou aqui para ajudar com informações sobre o vestibular e campus. O que você gostaria de saber?' }
  ]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSendMessage = async (userInput) => {
    const userMessage = { sender: 'user', text: userInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await sendChatMessage(userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: response.reply },
      ]);
    } catch (error) {
      console.error("Erro ao buscar resposta do bot:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: "Desculpe, algo deu errado: " + error.message },
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
    <div className={`flex flex-col w-full h-full overflow-hidden transition-all ${bgClass}`}>
      {/* Chat Messages Area - Takes all available space */}
      <div className="flex-1 overflow-y-auto w-full">
        <ChatMessages messages={messages} loading={loading} theme={theme} />
      </div>
      
      {/* Chat Input Area - Fixed at bottom */}
      <div className={`flex-shrink-0 border-t px-4 sm:px-6 py-2 sm:py-3 ${theme === 'dark' ? 'border-gray-700 bg-[#1A1B1C]' : 'border-gray-200 bg-white'}`}>
        <div className="w-full max-w-2xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;