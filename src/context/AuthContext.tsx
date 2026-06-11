import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { authService, UserProfile } from '../services/authService';

WebBrowser.maybeCompleteAuthSession();

export type UserRole = 'owner' | 'trainer' | 'member' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
  onboarded?: boolean;
  dietPreference?: string;
  status?: string;
  streak?: number;
  healthScore?: number;
  phone?: string;
  goal?: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<User>;
  signup: (userData: { name: string; email: string; role: 'owner' | 'trainer' | 'member'; password?: string }) => Promise<User | null>;
  loginWithGoogle: (role?: 'owner' | 'trainer' | 'member') => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to map Supabase database profile to App User model
function mapProfileToUser(profile: UserProfile): User {
  // Map 'gym_owner' (DB role) -> 'owner' (App role)
  const mappedRole: UserRole = profile.role === 'gym_owner' ? 'owner' : profile.role;
  
  return {
    id: profile.id,
    name: profile.full_name || profile.email.split('@')[0],
    email: profile.email,
    role: mappedRole,
    avatar_url: profile.avatar_url,
    phone: profile.phone || undefined,
    // Add default fallbacks for local App views
    onboarded: true, // We can determine this from onboarding records or default to true
    status: 'active',
    streak: 0,
    healthScore: 70,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile data on mount and session change
  const syncProfile = async (userId: string): Promise<User | null> => {
    try {
      const profile = await authService.getProfile(userId);
      if (profile) {
        const mappedUser = mapProfileToUser(profile);
        setUser(mappedUser);
        await AsyncStorage.setItem('fitpulse_user', JSON.stringify(mappedUser));
        return mappedUser;
      }
    } catch (e) {
      console.error('Failed to sync profile from Supabase', e);
    }
    return null;
  };

  useEffect(() => {
    // 1. Check active session on startup
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await syncProfile(session.user.id);
        } else {
          // If no session is active, try loading cached local user if any
          const storedUser = await AsyncStorage.getItem('fitpulse_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (e) {
        console.error('Session restoration failed', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 2. Subscribe to auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      if (session?.user) {
        await syncProfile(session.user.id);
      } else {
        setUser(null);
        await AsyncStorage.removeItem('fitpulse_user');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string): Promise<User> => {
    setIsLoading(true);
    try {
      // Use fallback password for quick demo logins if none provided
      const resolvedPassword = password || 'password';
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: resolvedPassword,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from sign in');

      const syncedUser = await syncProfile(data.user.id);
      if (!syncedUser) throw new Error('Failed to load user profile after sign in');

      return syncedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { name: string; email: string; role: 'owner' | 'trainer' | 'member'; password?: string }): Promise<User | null> => {
    // 1. Check rate limit
    const lastSignupStr = await AsyncStorage.getItem('fitpulse_last_signup_time');
    const now = Date.now();
    const cooldown = 60000; // 60 seconds cooldown
    if (lastSignupStr) {
      const lastSignup = parseInt(lastSignupStr, 10);
      if (now - lastSignup < cooldown) {
        const remaining = Math.ceil((cooldown - (now - lastSignup)) / 1000);
        throw new Error(`Please wait ${remaining} seconds before signing up again.`);
      }
    }

    setIsLoading(true);
    try {
      // Map 'owner' (App role) -> 'gym_owner' (DB role)
      const mappedRole = userData.role === 'owner' ? 'gym_owner' : userData.role;
      const redirectUrl = Linking.createURL('/');

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'password',
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.name,
            role: mappedRole,
          },
        },
      });

      if (error) {
        if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
          throw new Error('Email rate limit exceeded. Please check your inbox or try again in a few minutes.');
        }
        if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('user already exists')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        throw error;
      }
      if (!data.user) throw new Error('No user returned from signup');

      // Set cooldown on successful call (or even rate limited attempt to protect the API)
      await AsyncStorage.setItem('fitpulse_last_signup_time', now.toString());

      // If email confirmation is enabled, session will be null
      if (!data.session) {
        return null;
      }

      // Wait a moment for trigger execution to populate DB profiles table
      let profile = null;
      let retries = 5;
      while (retries > 0 && !profile) {
        profile = await authService.getProfile(data.user.id);
        if (!profile) {
          await new Promise((r) => setTimeout(r, 500));
          retries--;
        }
      }

      if (!profile) {
        throw new Error('Profile creation timed out');
      }

      const syncedUser = mapProfileToUser(profile);
      setUser(syncedUser);
      await AsyncStorage.setItem('fitpulse_user', JSON.stringify(syncedUser));
      return syncedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (role: 'owner' | 'trainer' | 'member' = 'member'): Promise<User | null> => {
    setIsLoading(true);
    try {
      const redirectUrl = Linking.createURL('/');
      console.log('[Google Auth] Generated redirectUrl:', redirectUrl);
      
      await new Promise<void>((resolve) => {
        Alert.alert(
          'Redirect Debugger',
          `Redirect URL: ${redirectUrl}\n\nPlease click Proceed to test.`,
          [{ text: 'Proceed', onPress: () => resolve() }],
          { cancelable: false }
        );
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No OAuth URL returned');
      console.log('[Google Auth] Supabase OAuth URL:', data.url);

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success' && result.url) {
        const hash = result.url.split('#')[1];
        if (hash) {
          const params = Object.fromEntries(new URLSearchParams(hash));
          const accessToken = params.access_token;
          const refreshToken = params.refresh_token;

          if (accessToken && refreshToken) {
            const { data: authData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) throw sessionError;
            if (!authData.user) throw new Error('No user returned after Google session setup');

            let profile = null;
            let retries = 5;
            while (retries > 0 && !profile) {
              profile = await authService.getProfile(authData.user.id);
              if (!profile) {
                await new Promise((r) => setTimeout(r, 500));
                retries--;
              }
            }

            const mappedRole = role === 'owner' ? 'gym_owner' : role;
            if (!profile) {
              profile = await authService.updateProfile(authData.user.id, {
                full_name: authData.user.user_metadata.full_name || authData.user.email?.split('@')[0] || 'Google User',
                role: mappedRole as any,
              });
            } else if (profile.role === 'member' && mappedRole !== 'member') {
              profile = await authService.updateProfile(authData.user.id, {
                role: mappedRole as any,
              });
            }

            const syncedUser = mapProfileToUser(profile);
            setUser(syncedUser);
            await AsyncStorage.setItem('fitpulse_user', JSON.stringify(syncedUser));
            return syncedUser;
          }
        }
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      await AsyncStorage.removeItem('fitpulse_user');
    } catch (e) {
      console.error('Signout error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Map properties back to database format
      const profileUpdates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at' | 'updated_at'>> = {};
      if (data.name !== undefined) profileUpdates.full_name = data.name;
      if (data.phone !== undefined) profileUpdates.phone = data.phone;
      if (data.avatar_url !== undefined) profileUpdates.avatar_url = data.avatar_url;
      if (data.role !== undefined) {
        profileUpdates.role = data.role === 'owner' ? 'gym_owner' : data.role as any;
      }

      const updatedProfile = await authService.updateProfile(user.id, profileUpdates);
      if (updatedProfile) {
        const mappedUser = mapProfileToUser(updatedProfile);
        setUser(mappedUser);
        await AsyncStorage.setItem('fitpulse_user', JSON.stringify(mappedUser));
      }
    } catch (e) {
      console.error('Failed to update user profile', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, updateUser, isLoading }}>
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
