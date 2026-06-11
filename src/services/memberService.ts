import { supabase } from './supabase';

export interface Member {
  id: string;
  gym_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  joining_date: string;
  membership_type: string;
  membership_expiry: string | null;
  status: 'active' | 'expired' | 'inactive';
  profile_image: string | null;
  created_at: string;
}

export const memberService = {
  /**
   * Add a new member to a gym.
   */
  async addMember(member: Omit<Member, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('members')
      .insert([member])
      .select()
      .single();

    if (error) throw error;
    return data as Member;
  },

  /**
   * List all members belonging to a specific gym.
   */
  async getMembers(gymId: string) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('gym_id', gymId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Member[];
  },

  /**
   * Fetch a single member record by ID.
   */
  async getMemberById(memberId: string) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single();

    if (error) throw error;
    return data as Member;
  },

  /**
   * Fetch a member record by their associated profile user ID.
   */
  async getMemberByUserId(userId: string) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Member;
  },

  /**
   * Update an existing member record.
   */
  async updateMember(memberId: string, updates: Partial<Omit<Member, 'id' | 'gym_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data as Member;
  },

  /**
   * Delete a member record.
   */
  async deleteMember(memberId: string) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
    return true;
  },
};
