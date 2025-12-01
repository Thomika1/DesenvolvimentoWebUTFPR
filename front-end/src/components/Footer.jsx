import React from "react";
import { useTheme } from "../ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  
  const bgClass = theme === 'dark'
    ? 'bg-[#2A2B2C] border-[#3A3B3C]'
    : 'bg-gray-100 border-gray-300';
  
  const textClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <footer className={`w-full ${bgClass} border-t py-3 text-center text-xs ${textClass} mt-8`}>
      Projeto desenvolvido como método de avaliação da disciplina de Desenvolvimento Web (UTFPR).<br />
      Os dados utilizados são de acesso público.
    </footer>
  );
}
