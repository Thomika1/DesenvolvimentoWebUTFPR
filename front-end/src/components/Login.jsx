import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-black mb-4">Login</h2>
        <input
          type="email"
          placeholder="E-mail"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-600 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;