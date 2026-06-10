import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "./AuthContext";

export interface AITokenTransaction {
  id: string;
  type: "deduction" | "topup" | "reset";
  amount: number;
  date: string;
  details?: string;
  balanceAfter: number;
}

interface AITokenContextType {
  tokens: number;
  quota: number;
  useToken: () => Promise<boolean>;
  buyTokens: (amount: number, txDetails: string) => Promise<void>;
  transactions: AITokenTransaction[];
  nextResetDate: string;
}

const AITokenContext = createContext<AITokenContextType | undefined>(undefined);

export function AITokenProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tokens, setTokens] = useState(300);
  const quota = 300;
  const [transactions, setTransactions] = useState<AITokenTransaction[]>([]);
  const [nextResetDate, setNextResetDate] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setNextResetDate(nextMonth.toISOString());

    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(`ai_tokens_${user.id}`);
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setTokens(parsed.tokens || 300);
          setTransactions(parsed.transactions || []);
          
          if (parsed.lastResetMonth !== now.getMonth()) {
             await handleReset(now.getMonth(), parsed.transactions || []);
          }
        } else {
          await handleReset(now.getMonth(), []);
        }
      } catch (e) {
        console.error("Failed to load AI tokens", e);
      }
    };
    loadData();
  }, [user]);

  const handleReset = async (currentMonth: number, existingTxs: AITokenTransaction[]) => {
    setTokens(quota);
    const rsTx: AITokenTransaction = {
      id: "tx_" + Date.now().toString(),
      type: "reset",
      amount: quota,
      date: new Date().toISOString(),
      details: "Monthly free quota reset",
      balanceAfter: quota
    };
    const newTxs = [rsTx, ...existingTxs];
    setTransactions(newTxs);
    await saveState(quota, newTxs, currentMonth);
  };

  const saveState = async (newTokens: number, newTxs: AITokenTransaction[], month?: number) => {
    if (!user) return;
    const currentMonth = month !== undefined ? month : new Date().getMonth();
    try {
      await AsyncStorage.setItem(`ai_tokens_${user.id}`, JSON.stringify({
        tokens: newTokens,
        transactions: newTxs,
        lastResetMonth: currentMonth
      }));
    } catch (e) {
      console.error("Failed to save AI tokens state", e);
    }
  };

  const useToken = async () => {
    if (tokens <= 0) return false;
    const newTokens = tokens - 1;
    setTokens(newTokens);
    
    const tx: AITokenTransaction = {
      id: "tx_" + Date.now().toString(),
      type: "deduction",
      amount: 1,
      date: new Date().toISOString(),
      details: "AI Message generation",
      balanceAfter: newTokens
    };
    const newTxs = [tx, ...transactions];
    setTransactions(newTxs);
    await saveState(newTokens, newTxs);
    return true;
  };

  const buyTokens = async (amount: number, details: string) => {
    const newTokens = tokens + amount;
    setTokens(newTokens);
    
    const tx: AITokenTransaction = {
      id: "tx_" + Date.now().toString(),
      type: "topup",
      amount: amount,
      date: new Date().toISOString(),
      details: details,
      balanceAfter: newTokens
    };
    
    const newTxs = [tx, ...transactions];
    setTransactions(newTxs);
    await saveState(newTokens, newTxs);
  };

  return (
    <AITokenContext.Provider value={{ tokens, quota, useToken, buyTokens, transactions, nextResetDate }}>
      {children}
    </AITokenContext.Provider>
  );
}

export function useAITokens() {
  const context = useContext(AITokenContext);
  if (context === undefined) {
    throw new Error('useAITokens must be used within an AITokenProvider');
  }
  return context;
}
