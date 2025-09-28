import React, { useRef, useEffect } from 'react';
import Spinner from './Spinner';

const ChatMessages = ({ messages, loading, theme }) => {
  // 1. Criamos uma referência para o final da lista de mensagens
  const messagesEndRef = useRef(null);

  // Função para rolar a tela para o final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 2. Usamos o useEffect para rolar para o final sempre que as mensagens mudarem ou o spinner aparecer/desaparecer
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Cores das mensagens conforme o tema
  const userMsgClass =
    theme === 'dark'
      ? 'bg-yellow-500 text-black'
      : 'bg-black text-yellow-400';
  const botMsgClass =
    theme === 'dark'
      ? 'bg-[#353535] text-[#E3E3E3]'
      : 'bg-gray-200 text-gray-800';

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-col space-y-4">
        {Array.isArray(messages) && messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${
                message.sender === 'user' ? userMsgClass : botMsgClass
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`${botMsgClass} rounded-lg p-4`}>
              <Spinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;