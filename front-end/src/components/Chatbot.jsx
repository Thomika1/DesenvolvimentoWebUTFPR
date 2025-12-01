import { useState } from 'react';
import { useImmer } from 'use-immer';

import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';

function Chatbot() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useImmer([]); // [1] useImmer é ótimo para isso!
  const [newMessage, setNewMessage] = useState('');

  const isLoading = messages.length && messages[messages.length - 1].loading;

  // --- NOVA FUNÇÃO DE SUBMISSÃO ---
  const submitNewMessage = () => {
    if (!newMessage.trim() || isLoading) return;

    // 1. Adiciona a mensagem do usuário (imutabilidade com Immer)
    setMessages(draft => {
      draft.push({
        role: 'user',
        content: newMessage.trim(),
        loading: false,
        error: false,
      });
    });

    // 2. Limpa o input
    setNewMessage('');

    // 3. Simula a resposta da IA com um pequeno atraso
    setTimeout(() => {
      const mockResponse = "🤖 Olá! Esta é uma resposta mockada da IA. O envio foi um sucesso!";

      // Adiciona a resposta do bot após o atraso
      setMessages(draft => {
        draft.push({
          role: 'assistant',
          content: mockResponse,
          loading: false,
          error: false,
        });
      });
    }, 1000); // 1 segundo de atraso
  };




  return (
    <div className='relative grow flex flex-col gap-6 pt-6'>
      {messages.length === 0 && (
        <div className='mt-3 font-urbanist text-primary-blue text-xl font-light space-y-2'>
          <p>👋 Welcome!</p>
          <p>I am powered by the latest technology reports from leading institutions like the World Bank, the World Economic Forum, McKinsey, Deloitte and the OECD.</p>
          <p>Ask me anything about the latest technology trends.</p>
        </div>
      )}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
      />
      <ChatInput
        newMessage={newMessage}
        isLoading={isLoading}
        setNewMessage={setNewMessage}
        submitNewMessage={submitNewMessage}
      />
    </div>
  );
}

export default Chatbot;