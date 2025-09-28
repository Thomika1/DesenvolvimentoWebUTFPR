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
  // 1. Crie a nova mensagem do usuário
  const userMessage = { sender: 'user', text: userInput };

  // 2. Crie a lista de mensagens atualizada IMEDIATAMENTE
  const updatedMessages = [...messages, userMessage];

  // 3. Atualize o estado da UI com a nova lista completa
  setMessages(updatedMessages);
  setLoading(true);

  try {
    // 4. Prepare o payload para a API usando a MESMA lista atualizada
    //    Não precisa mais adicionar o userInput no final, pois ele já está na lista.
    const groqMessages = updatedMessages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const aiText = await fetchGroqResponse(groqMessages);

    // Adiciona apenas a resposta do bot ao estado atual
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', text: aiText },
    ]);
  } catch (error) {
    console.error("Erro ao buscar resposta do bot:", error);
    // Adiciona apenas a mensagem de erro ao estado atual
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