import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/lib/api';

type UserRole = 'owner' | 'trainer' | 'member';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  onboarded?: boolean;
  dietPreference?: 'Vegetarian' | 'Vegan' | 'Non-Vegetarian' | '';
  status?: string;
  streak?: number;
  healthScore?: number;
  phone?: string;
  goal?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<User>;
  signup: (userData: any) => Promise<User>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('fitpulse_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user from AsyncStorage", e);
      }
    };
    loadStoredUser();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        await AsyncStorage.setItem('fitpulse_user', JSON.stringify(data.user));
        await AsyncStorage.setItem('fitpulse_token', data.token);
        return data.user;
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        await AsyncStorage.setItem('fitpulse_user', JSON.stringify(data.user));
        await AsyncStorage.setItem('fitpulse_token', data.token);
        return data.user;
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Signup failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('fitpulse_user');
      await AsyncStorage.removeItem('fitpulse_token');
    } catch (e) {
      console.error(e);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (user) {
       const updatedUser = { ...user, ...data };
       setUser(updatedUser);
       try {
         await AsyncStorage.setItem('fitpulse_user', JSON.stringify(updatedUser));
         await fetch(`${API_URL}/api/user/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id, ...data })
         });
       } catch (e) {
         console.error(e);
       }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
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
