import { supabase } from './supabase';

export interface Payment {
  id: string;
  gym_id: string;
  member_id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'upi' | 'net_banking';
  payment_status: 'paid' | 'pending' | 'failed';
  transaction_id: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  gym_id: string;
  plan_name: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'canceled';
}

export const paymentService = {
  // --- Payments CRUD ---
  async addPayment(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  async getPayments(gymId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        member:members (name, email)
      `)
      .eq('gym_id', gymId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as (Payment & { member: { name: string; email: string } })[];
  },

  async getMemberPayments(memberId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Payment[];
  },

  async updatePayment(paymentId: string, updates: Partial<Omit<Payment, 'id' | 'gym_id' | 'member_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  async deletePayment(paymentId: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId);

    if (error) throw error;
    return true;
  },

  // --- Subscriptions CRUD ---
  async addSubscription(sub: Omit<Subscription, 'id'>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([sub])
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  },

  async getSubscriptions(gymId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('gym_id', gymId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data as Subscription[];
  },

  async updateSubscription(subId: string, updates: Partial<Omit<Subscription, 'id' | 'gym_id'>>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subId)
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  },

  async deleteSubscription(subId: string) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', subId);

    if (error) throw error;
    return true;
  },
};
