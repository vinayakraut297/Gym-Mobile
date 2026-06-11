import { supabase } from './supabase';

export interface Attendance {
  id: string;
  member_id: string;
  gym_id: string;
  check_in: string;
  check_out: string | null;
  date: string;
}

export const attendanceService = {
  /**
   * Log check-in for a member.
   */
  async checkIn(memberId: string, gymId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .insert([{
        member_id: memberId,
        gym_id: gymId,
        check_in: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Attendance;
  },

  /**
   * Log check-out for a member.
   */
  async checkOut(attendanceId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .update({
        check_out: new Date().toISOString(),
      })
      .eq('id', attendanceId)
      .select()
      .single();

    if (error) throw error;
    return data as Attendance;
  },

  /**
   * Get attendance logs for a gym.
   */
  async getAttendanceLogs(gymId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        member:members (name, email, profile_image)
      `)
      .eq('gym_id', gymId)
      .order('check_in', { ascending: false });

    if (error) throw error;
    return data as (Attendance & { member: { name: string; email: string | null; profile_image: string | null } })[];
  },

  /**
   * Get attendance logs for a member.
   */
  async getMemberAttendance(memberId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('member_id', memberId)
      .order('check_in', { ascending: false });

    if (error) throw error;
    return data as Attendance[];
  },

  /**
   * Subscribe to realtime attendance updates for a specific gym.
   */
  subscribeToAttendance(gymId: string, onUpdate: (payload: any) => void) {
    return supabase
      .channel(`gym-attendance-${gymId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance',
          filter: `gym_id=eq.${gymId}`,
        },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();
  },
};
