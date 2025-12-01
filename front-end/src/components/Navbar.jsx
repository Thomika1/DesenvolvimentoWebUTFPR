import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import AvatarMenu from "./AvatarMenu";
import Login from "./Login";
import Register from "./Register";

export default function Navbar({ user, onLogout, onLogin }) {
  const location = useLocation();
  const { theme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const headerClass = theme === 'dark'
    ? 'bg-[#1E1F20]'
    : 'bg-yellow-400';
  
  const textClass = theme === 'dark' ? 'text-[#E3E3E3]' : 'text-black';
  const buttonClass = theme === 'dark'
    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
    : 'bg-yellow-600 hover:bg-yellow-700 text-white';

  const handleLoginClose = (userData) => {
    if (userData?.action === 'register') {
      setShowLoginModal(false);
      setShowRegisterModal(true);
    } else if (userData) {
      onLogin(userData);
      setShowLoginModal(false);
    }
  };

  const handleRegisterClose = (userData) => {
    if (userData) {
      onLogin(userData);
      setShowRegisterModal(false);
    }
  };

  return (
    <>
      <nav className={`w-full ${headerClass} shadow-sm py-3 px-3 sm:px-4 md:px-6 flex items-center justify-between`}>
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
          <Link to="/" className={`font-bold text-sm sm:text-lg md:text-xl ${textClass} whitespace-nowrap`}>
            Guia UTFPR
          </Link>
          <Link
            to="/contato"
            className={`hidden sm:inline text-xs sm:text-sm md:text-base ${textClass} ${
              location.pathname === "/contato" ? "underline" : ""
            } hover:underline transition`}
          >
            Entre em Contato
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {user ? (
            <AvatarMenu user={user} onLogout={onLogout} />
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className={`${buttonClass} px-3 sm:px-4 py-2 rounded transition font-semibold text-xs sm:text-sm whitespace-nowrap`}
            >
              Entrar
            </button>
          )}
        </div>
      </nav>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${theme === 'dark' ? 'bg-[#2A2B2C]' : 'bg-white'} rounded-lg p-5 sm:p-6 max-w-sm w-full shadow-xl`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-[#E3E3E3]' : 'text-black'}`}>
                Login
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-2xl leading-none hover:scale-110 transition`}
              >
                ×
              </button>
            </div>
            <Login onLogin={handleLoginClose} isModal={true} />
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${theme === 'dark' ? 'bg-[#2A2B2C]' : 'bg-white'} rounded-lg p-5 sm:p-6 max-w-sm w-full shadow-xl`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-[#E3E3E3]' : 'text-black'}`}>
                Registrar
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-2xl leading-none hover:scale-110 transition`}
              >
                ×
              </button>
            </div>
            <Register onRegister={handleRegisterClose} onBackToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }} isModal={true} />
          </div>
        </div>
      )}
    </>
  );
}
