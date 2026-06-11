import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'super_admin' | 'gym_owner' | 'trainer' | 'member';
  created_at: string;
  updated_at: string;
}

export const authService = {
  /**
   * Sign up a new user with an email, password, full name, and role.
   */
  async signUp(email: string, password: string, fullName: string, role: UserProfile['role'] = 'member') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign in an existing user with email and password.
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Log out the current user session.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Request password reset for a given email address.
   */
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'fitpulse://reset-password',
    });
    if (error) throw error;
    return data;
  },

  /**
   * Get the current active user session.
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Get user profile details from the public.profiles database table.
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      throw error;
    }
    return data as UserProfile;
  },

  /**
   * Update the user's profile details.
   */
  async updateProfile(userId: string, updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },
};
