import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';

interface Merchant { id: string; email: string; name: string; apiKey: string; webhookUrl?: string }
interface AuthCtx { merchant: Merchant | null; login: (email: string, password: string) => Promise<void>; logout: () => void }

const AuthContext = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) api.get('/auth/me').then((r) => setMerchant(r.data)).catch(() => localStorage.removeItem('token'));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setMerchant(data.merchant);
  }

  function logout() {
    localStorage.removeItem('token');
    setMerchant(null);
  }

  return <AuthContext.Provider value={{ merchant, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
