import { supabase } from './supabase';

export interface Gym {
  id: string;
  owner_id: string | null;
  gym_name: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  subscription_plan: string;
  subscription_status: 'active' | 'inactive' | 'canceled' | 'past_due';
  created_at: string;
}

export interface GymStats {
  totalMembers: number;
  activeMemberships: number;
  revenue: number;
  attendanceToday: number;
  expiringMemberships: number;
  trainerCount: number;
}

export const gymService = {
  /**
   * Create a new Gym record.
   */
  async createGym(gym: Omit<Gym, 'id' | 'created_at' | 'subscription_plan' | 'subscription_status'>) {
    const { data, error } = await supabase
      .from('gyms')
      .insert([gym])
      .select()
      .single();

    if (error) throw error;
    return data as Gym;
  },

  /**
   * Get a specific Gym by ID.
   */
  async getGym(gymId: string) {
    const { data, error } = await supabase
      .from('gyms')
      .select('*')
      .eq('id', gymId)
      .single();

    if (error) throw error;
    return data as Gym;
  },

  /**
   * List all gyms.
   */
  async listGyms() {
    const { data, error } = await supabase
      .from('gyms')
      .select('*')
      .order('gym_name', { ascending: true });

    if (error) throw error;
    return data as Gym[];
  },

  /**
   * Update an existing Gym record.
   */
  async updateGym(gymId: string, updates: Partial<Omit<Gym, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('gyms')
      .update(updates)
      .eq('id', gymId)
      .select()
      .single();

    if (error) throw error;
    return data as Gym;
  },

  /**
   * Delete a Gym record.
   */
  async deleteGym(gymId: string) {
    const { error } = await supabase
      .from('gyms')
      .delete()
      .eq('id', gymId);

    if (error) throw error;
    return true;
  },

  /**
   * Fetch statistical aggregates for a specific gym dashboard.
   */
  async getGymStats(gymId: string): Promise<GymStats> {
    const todayStr = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const thirtyDaysLaterStr = thirtyDaysLater.toISOString().split('T')[0];

    const [
      totalMembersRes,
      activeMembersRes,
      revenueRes,
      attendanceTodayRes,
      expiringMembersRes,
      trainersRes,
    ] = await Promise.all([
      // Total members
      supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId),

      // Active members
      supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId)
        .eq('status', 'active'),

      // Revenue sum (All paid payments)
      supabase
        .from('payments')
        .select('amount')
        .eq('gym_id', gymId)
        .eq('payment_status', 'paid'),

      // Attendance checked in today
      supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId)
        .eq('date', todayStr),

      // Expiring memberships in the next 30 days
      supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId)
        .eq('status', 'active')
        .gte('membership_expiry', todayStr)
        .lte('membership_expiry', thirtyDaysLaterStr),

      // Trainer count
      supabase
        .from('trainers')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId),
    ]);

    // Check for errors (exclude non-critical count checks)
    if (totalMembersRes.error) throw totalMembersRes.error;
    if (activeMembersRes.error) throw activeMembersRes.error;
    if (revenueRes.error) throw revenueRes.error;
    if (attendanceTodayRes.error) throw attendanceTodayRes.error;
    if (expiringMembersRes.error) throw expiringMembersRes.error;
    if (trainersRes.error) throw trainersRes.error;

    // Calculate revenue sum
    const totalRevenue = (revenueRes.data || []).reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    return {
      totalMembers: totalMembersRes.count || 0,
      activeMemberships: activeMembersRes.count || 0,
      revenue: totalRevenue,
      attendanceToday: attendanceTodayRes.count || 0,
      expiringMemberships: expiringMembersRes.count || 0,
      trainerCount: trainersRes.count || 0,
    };
  },
};
