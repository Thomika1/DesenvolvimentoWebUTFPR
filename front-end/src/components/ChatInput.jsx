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
      ? 'bg-[#232324] text-[#E3E3E3] placeholder:text-gray-400 border-gray-700'
      : 'bg-white text-black placeholder:text-gray-700 border-gray-200';

  return (
    <form onSubmit={handleSubmit} className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center">
        <input
          type="text"
          className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${inputBg}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button
          type="submit"
          className={`ml-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2
            ${theme === 'dark'
              ? 'bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-500'
              : 'bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-500'}
          `}
        >
          Enviar
        </button>
      </div>
    </form>
  );
};

export default ChatInput;