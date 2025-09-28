import React from 'react';
import { useTheme } from '../ThemeContext';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  // Cores do sidebar conforme o tema
  const sidebarClass = theme === 'dark'
    ? 'bg-[#1E1F20] text-[#E3E3E3]'
    : 'bg-white text-black border-r border-black';

  return (
    <aside className={`hidden lg:flex flex-col w-64 ${sidebarClass} p-4`}>
      <h1 className="text-2xl font-bold mb-6">Meu App</h1>
      <nav>
        <ul>
          <li className="mb-3">
            <a href="#" className="p-2 rounded-md hover:bg-gray-700 block">Chat Principal</a>
          </li>
          <li className="mb-3">
            <a href="#" className="p-2 rounded-md hover:bg-gray-700 block">Histórico</a>
          </li>
          <li className="mb-3">
            <a href="#" className="p-2 rounded-md hover:bg-gray-700 block">Configurações</a>
          </li>
        </ul>
      </nav>
      <div className="flex items-center mt-6 gap-3">
        <span className="text-sm font-medium select-none">
          {theme === 'dark' ? 'Tema' : 'Tema'}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={theme === 'light'}
            onChange={toggleTheme}
            className="sr-only peer"
          />
          <div
            className={`
              w-11 h-6 rounded-full
              peer
              ${theme === 'dark'
                ? 'bg-gray-600'
                : 'bg-yellow-400 border border-black'}
              after:content-[''] after:absolute after:top-0.5 after:left-[2px]
              after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all
              ${theme === 'dark'
                ? 'after:translate-x-0 after:bg-[#1E1F20] after:border-gray-400'
                : 'after:translate-x-5 after:bg-black after:border-yellow-400'}
            `}
            style={{ transition: 'background 0.2s' }}
          ></div>
        </label>
      </div>
      <div className="mt-auto">
        <a href="#" className="p-2 rounded-md hover:bg-gray-700 block">Perfil</a>
      </div>
    </aside>
  );
};

export default Sidebar;