import { supabase } from './supabase';

export interface Trainer {
  id: string;
  gym_id: string;
  user_id: string | null;
  name: string;
  specialization: string | null;
  experience: number | null;
  phone: string | null;
  salary: number | null;
  image: string | null;
  created_at: string;
}

export const trainerService = {
  /**
   * Add a new trainer to a gym.
   */
  async addTrainer(trainer: Omit<Trainer, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('trainers')
      .insert([trainer])
      .select()
      .single();

    if (error) throw error;
    return data as Trainer;
  },

  /**
   * List all trainers in a specific gym.
   */
  async getTrainers(gymId: string) {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .eq('gym_id', gymId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Trainer[];
  },

  /**
   * Fetch a single trainer by ID.
   */
  async getTrainerById(trainerId: string) {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .eq('id', trainerId)
      .single();

    if (error) throw error;
    return data as Trainer;
  },

  /**
   * Fetch a trainer record by their associated profile user ID.
   */
  async getTrainerByUserId(userId: string) {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Trainer;
  },

  /**
   * Update an existing trainer record.
   */
  async updateTrainer(trainerId: string, updates: Partial<Omit<Trainer, 'id' | 'gym_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('trainers')
      .update(updates)
      .eq('id', trainerId)
      .select()
      .single();

    if (error) throw error;
    return data as Trainer;
  },

  /**
   * Delete a trainer record.
   */
  async deleteTrainer(trainerId: string) {
    const { error } = await supabase
      .from('trainers')
      .delete()
      .eq('id', trainerId);

    if (error) throw error;
    return true;
  },
};
