import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  activeLockModalApp: any | null;
  openLockModal: (app: any) => void;
  closeLockModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'demo-user-uuid-101',
    name: 'Alex Rivera',
    email: 'alex@lockme.ai',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    biometricsEnabled: true
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('lockme_token') || 'demo_token_123');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeLockModalApp, setActiveLockModalApp] = useState<any | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.getMe();
        if (res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Using default demo session:', err);
      }
    };
    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('lockme_token', res.token);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.signup({ name, email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('lockme_token', res.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lockme_token');
  };

  const openLockModal = (app: any) => setActiveLockModalApp(app);
  const closeLockModal = () => setActiveLockModalApp(null);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      activeLockModalApp,
      openLockModal,
      closeLockModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
