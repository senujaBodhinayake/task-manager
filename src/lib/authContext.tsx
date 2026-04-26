'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading]     = useState(true);

  // On app load, try to get a new access token using the refresh token cookie
  useEffect(() => {
    async function restore() {
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
        }
      } finally {
        setIsLoading(false);
      }
    }
    restore();
  }, []);

  function login(token: string) {
    setAccessToken(token);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);