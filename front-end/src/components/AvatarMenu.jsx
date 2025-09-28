import React, { useState, useRef, useEffect } from 'react';

const AvatarMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-black font-bold shadow hover:bg-yellow-600 transition"
        title={user?.email}
      >
        {user?.email?.[0]?.toUpperCase() || "U"}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg border z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">{user?.email}</div>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;