import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, theme }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const inputBg =
    theme === 'dark'
      ? 'bg-[#232324] text-[#E3E3E3] placeholder:text-gray-500 border-gray-600'
      : 'bg-gray-100 text-black placeholder:text-gray-500 border-gray-300';

  return (
    <div className="w-full">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="w-full flex items-center gap-2 sm:gap-3">
        <input
          type="text"
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-full border-2 focus:outline-none focus:ring-0 focus:border-yellow-500 transition-all ${inputBg}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Faça uma pergunta..."
        />
        <button
          type="submit"
          title="Enviar"
          className={`p-2.5 sm:p-3 rounded-full font-bold text-lg sm:text-xl transition-all transform hover:scale-110 active:scale-95 flex-shrink-0 shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600'
          }`}
        >
          ➤
        </button>
      </form>

      {/* Disclaimer */}
      <p className={`text-xs mt-2.5 px-1 py-1 text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        O Guia UTFPR é uma ferramenta de apoio e pode não fornecer respostas 100% precisas. Sempre verifique as informações obtidas.
      </p>
    </div>
  );
};

export default ChatInput;