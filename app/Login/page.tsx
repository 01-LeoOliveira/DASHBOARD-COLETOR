"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../authContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      router.push('/Admin');
    } else {
      alert('Credenciais inválidas');
    }
  };

  const handleUserAreaClick = () => {
    router.push('/'); // Ajuste o caminho para a página da Área do Usuário
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Botão Área do Usuário */}
      <div className="absolute top-1 left-2">
        <button
          onClick={handleUserAreaClick}
          className="px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
        >
          Área do usuário
        </button>
      </div>
      
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/image/GrupoSC.png"
          alt="Logo da Empresa"
          width={200}
          height={100}
        />
      </div>
      
      {/* Formulário de Login */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login de Administrador</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
