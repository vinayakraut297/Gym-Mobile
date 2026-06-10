import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, useColorScheme, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Bot, Send, Coins, Zap } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useAITokens } from '@/context/AITokenContext';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AITrainerScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { user } = useAuth();
  const { tokens, useToken } = useAITokens();

  const [messages, setMessages] = useState<{ role: 'assistant' | 'user' | 'system'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!user) return;
    setMessages([
      { role: 'assistant', text: "Hey! I'm your FitPulse AI Personal Trainer. I have analyzed your recent workouts and nutrition. Ask me anything about modifications, form, recovery, or diet suggestions!" }
    ]);
  }, [user]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || loading) return;

    if (tokens <= 0) {
      setMessages(prev => [
        ...prev,
        { role: 'user', text: textToSend },
        { role: 'system', text: "You have 0 AI Tokens left. Please buy more tokens to continue." }
      ]);
      setInput('');
      return;
    }

    const success = await useToken();
    if (!success) return;

    const userMessage = { role: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await fetchWithAuth('/api/ai', {
        method: 'POST',
        body: JSON.stringify({
          text: textToSend,
          userRole: user?.role,
          userId: user?.id,
          messageHistory: messages.concat(userMessage)
        })
      });
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || "Sorry, I couldn't formulate a response." }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting to my database right now." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const getQuickActions = () => {
    return ["Suggest shoulder exercise", "Draft high-protein diet Plan", "Active recovery advice"];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerInfo}>
            <View style={[styles.botAvatar, { backgroundColor: colors.primary + '20' }]}>
              <Bot size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>FitPulse AI Coach</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Ask about workouts, diet, and recovery
              </Text>
            </View>
          </View>
          <View style={[styles.tokenBadge, { backgroundColor: colors.secondary }]}>
            <Coins size={14} color={colors.primary} />
            <Text style={[styles.tokenText, { color: colors.text }]}>{tokens}</Text>
          </View>
        </View>

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.msgRow,
                msg.role === 'user' ? styles.userRow : styles.botRow
              ]}
            >
              {msg.role !== 'user' && (
                <View style={[styles.avatarRound, { backgroundColor: msg.role === 'system' ? '#ef444415' : colors.primary + '15' }]}>
                  <Bot size={14} color={msg.role === 'system' ? '#ef4444' : colors.primary} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.role === 'user'
                    ? [styles.userBubble, { backgroundColor: colors.primary }]
                    : msg.role === 'system'
                    ? [styles.systemBubble, { borderColor: '#ef444430' }]
                    : [styles.botBubble, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    {
                      color: msg.role === 'user'
                        ? (scheme === 'dark' ? '#000000' : '#ffffff')
                        : msg.role === 'system'
                        ? '#ef4444'
                        : colors.text
                    }
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
          {loading && (
            <View style={[styles.msgRow, styles.botRow]}>
              <View style={[styles.avatarRound, { backgroundColor: colors.primary + '15' }]}>
                <Bot size={14} color={colors.primary} />
              </View>
              <View style={[styles.bubble, styles.botBubble, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
            {getQuickActions().map((action, i) => (
              <Pressable
                key={i}
                onPress={() => handleSend(action)}
                disabled={tokens <= 0 || loading}
                style={[styles.actionBadge, { borderColor: colors.primary + '30', backgroundColor: colors.primary + '05' }]}
              >
                <Text style={[styles.actionText, { color: colors.primary }]}>{action}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Input Form */}
        <View style={[styles.inputForm, { borderTopColor: colors.border, backgroundColor: colors.backgroundElement }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={tokens > 0 ? "Ask your coach..." : "0 tokens left..."}
            placeholderTextColor={colors.textSecondary}
            editable={tokens > 0 && !loading}
            style={[styles.textInput, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
          />
          <Pressable
            onPress={() => handleSend()}
            disabled={!input.trim() || tokens <= 0 || loading}
            style={[styles.sendBtn, { backgroundColor: colors.primary }]}
          >
            <Send size={18} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tokenText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 16,
    gap: 16,
    flexGrow: 1,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  botRow: {
    alignSelf: 'flex-start',
  },
  avatarRound: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 2,
  },
  botBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  systemBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    backgroundColor: '#ef444408',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickActions: {
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#cccccc20',
  },
  quickActionsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  actionBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputForm: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
