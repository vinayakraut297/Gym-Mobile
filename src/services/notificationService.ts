import { supabase } from './supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read_status: boolean;
  created_at: string;
}

export const notificationService = {
  /**
   * Fetch all notifications for a specific user.
   */
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Notification[];
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  /**
   * Mark all notifications for a user as read.
   */
  async markAllAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data as Notification[];
  },

  /**
   * Delete a notification.
   */
  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  },

  /**
   * Subscribe to real-time notification events for a specific user.
   */
  subscribeToNotifications(userId: string, onNotification: (payload: any) => void) {
    return supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onNotification(payload);
        }
      )
      .subscribe();
  },
};
