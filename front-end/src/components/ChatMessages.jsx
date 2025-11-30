import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
    <div className="flex-1 overflow-y-auto flex flex-col px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col space-y-3 sm:space-y-4 max-w-5xl mx-auto w-full mt-auto">
        {Array.isArray(messages) && messages.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                Bem-vindo ao Guia UTFPR!
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Faça suas perguntas sobre os editais UTFPR
              </p>
            </div>
          </div>
        )}
        {Array.isArray(messages) && messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-fadeIn`}
          >
            <div
              className={`max-w-xs sm:max-w-sm lg:max-w-md px-4 py-3 rounded-xl break-words shadow-sm ${
                message.sender === 'user' ? userMsgClass : botMsgClass
              }`}
            >
              {message.sender === 'user' ? (
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
              ) : (
                <div className="text-sm sm:text-base leading-relaxed markdown-content">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      em: ({node, ...props}) => <em className="italic" {...props} />,
                      code: ({node, ...props}) => <code className="bg-opacity-20 px-1 rounded" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className={`${botMsgClass} rounded-xl p-4 shadow-sm`}>
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