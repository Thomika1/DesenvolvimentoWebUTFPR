import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import Chatbot from "../components/Chatbot";
import Login from "../components/Login";
import Register from "../components/Register";

export default function ChatPage({ user, onLogin, onLogout }) {
  const { theme } = useTheme();
  const [currentUser, setCurrentUser] = useState(user);
  const [showRegister, setShowRegister] = useState(false);
  
  const textClass = theme === 'dark' ? 'text-[#E3E3E3]' : 'text-black';
  const bgCardClass = theme === 'dark' ? 'bg-[#2A2B2C]' : 'bg-white';

  const handleLogin = (userData) => {
    if (userData?.action === 'register') {
      setShowRegister(true);
    } else if (userData) {
      setCurrentUser(userData);
      onLogin(userData);
    }
  };

  const handleRegister = (userData) => {
    if (userData) {
      setCurrentUser(userData);
      setShowRegister(false);
      onLogin(userData);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <div className={`${bgCardClass} rounded-lg p-6 sm:p-8 max-w-sm w-full shadow-lg`}>
          {!showRegister ? (
            <>
              <div className="mb-6 text-center">
                <h2 className={`text-2xl font-bold ${textClass} mb-2`}>Acesso ao Chat</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Faça login para usar o chatbot
                </p>
              </div>
              <Login onLogin={handleLogin} isModal={true} />
            </>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className={`text-2xl font-bold ${textClass} mb-2`}>Criar Conta</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Registre-se para usar o chatbot
                </p>
              </div>
              <Register
                onRegister={handleRegister}
                onBackToLogin={() => setShowRegister(false)}
                isModal={true}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full h-[calc(100vh-80px)] ${theme === 'dark' ? 'bg-[#1E1F20]' : 'bg-white'} transition-colors`}>
      <Chatbot user={currentUser} />
    </div>
  );
}
