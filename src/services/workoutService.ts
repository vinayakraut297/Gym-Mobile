import { supabase } from './supabase';

export interface WorkoutPlan {
  id: string;
  gym_id: string;
  trainer_id: string | null;
  member_id: string;
  title: string;
  description: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number | null;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string | null;
  muscle_group: string | null;
  instructions: string | null;
  image_url: string | null;
}

export interface WorkoutLogSet {
  reps: number;
  weight: number;
}

export interface WorkoutLog {
  id: string;
  member_id: string;
  exercise_id: string;
  sets: WorkoutLogSet[];
  reps: number | null;
  weight: number | null;
  calories: number | null;
  completed_at: string;
}

export const workoutService = {
  // --- Workout Plans CRUD ---
  async addWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutPlan;
  },

  async getWorkoutPlans(memberId: string) {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as WorkoutPlan[];
  },

  async updateWorkoutPlan(planId: string, updates: Partial<Omit<WorkoutPlan, 'id' | 'gym_id' | 'member_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('workout_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutPlan;
  },

  async deleteWorkoutPlan(planId: string) {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', planId);

    if (error) throw error;
    return true;
  },

  // --- Exercises CRUD ---
  async getExercises() {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Exercise[];
  },

  async addExercise(exercise: Omit<Exercise, 'id'>) {
    const { data, error } = await supabase
      .from('exercises')
      .insert([exercise])
      .select()
      .single();

    if (error) throw error;
    return data as Exercise;
  },

  async updateExercise(exerciseId: string, updates: Partial<Omit<Exercise, 'id'>>) {
    const { data, error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', exerciseId)
      .select()
      .single();

    if (error) throw error;
    return data as Exercise;
  },

  async deleteExercise(exerciseId: string) {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId);

    if (error) throw error;
    return true;
  },

  // --- Workout Logs ---
  async logWorkout(log: Omit<WorkoutLog, 'id' | 'completed_at'>) {
    const { data, error } = await supabase
      .from('workout_logs')
      .insert([log])
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutLog;
  },

  async getWorkoutLogs(memberId: string) {
    const { data, error } = await supabase
      .from('workout_logs')
      .select(`
        *,
        exercise:exercises (*)
      `)
      .eq('member_id', memberId)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data as (WorkoutLog & { exercise: Exercise })[];
  },

  async deleteWorkoutLog(logId: string) {
    const { error } = await supabase
      .from('workout_logs')
      .delete()
      .eq('id', logId);

    if (error) throw error;
    return true;
  },
};
