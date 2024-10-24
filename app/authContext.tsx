// authContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tempo de expiração do token (24 horas)
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica autenticação ao carregar
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const expiration = localStorage.getItem('token_expiration');

    if (token && expiration) {
      if (Number(expiration) > Date.now()) {
        setIsAuthenticated(true);
      } else {
        // Token expirado
        handleLogout();
      }
    }
    setLoading(false);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Aqui você deve implementar a chamada real à sua API
    // Este é apenas um exemplo
    if (username === 'admin' && password === '@dm!n!23') {
      const token = generateToken();
      const expiration = Date.now() + TOKEN_EXPIRATION;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('token_expiration', expiration.toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expiration');
    setIsAuthenticated(false);
    router.push('/');
  };

  const generateToken = () => {
    // Em produção, use um método mais seguro para gerar tokens
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout: handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// withAuth.tsx - HOC para proteger rotas
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return <div>Carregando...</div>; // Ou seu componente de loading
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
}