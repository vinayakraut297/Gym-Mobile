import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Modal, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { Bot, X, Send, Coins, Mic, AlertTriangle } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useAITokens } from '@/context/AITokenContext';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';

export function FloatingAICoach() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { user } = useAuth();
  const { tokens, useToken } = useAITokens();

  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user' | 'system'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!user) return;
    let greeting = "Hey! I'm your AI Coach. Ready to crush today's target?";
    if (user.role === 'owner') {
      greeting = "Hello Sarah. I'm your Business AI Assistant. I can help you analyze revenue, attendance, or churn risks.";
    } else if (user.role === 'trainer') {
      greeting = "Hey Coach! I'm your AI Assistant. Need help adjusting member plans or checking client progress?";
    }
    setMessages([{ role: 'assistant', text: greeting }]);
  }, [user, visible]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || loading) return;

    if (tokens <= 0) {
      setMessages(prev => [
        ...prev,
        { role: 'user', text: textToSend },
        { role: 'system', text: "You have 0 AI Tokens left. Please top up your tokens to continue." }
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
    if (user?.role === 'owner') {
      return ["Business Insight", "Attendance Summary", "Member Update"];
    } else if (user?.role === 'trainer') {
      return ["Client Progress", "Diet Suggestion", "Session Planning"];
    }
    return ["Modify Workout", "Diet Suggestion", "Recovery Advice"];
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.floatButton,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            opacity: pressed ? 0.9 : 1
          }
        ]}
      >
        <Bot size={28} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
      </Pressable>

      {/* Chat Modal */}
      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modalContainer, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerInfo}>
              <View style={[styles.botAvatar, { backgroundColor: colors.primary + '20' }]}>
                <Bot size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                  AI {user.role === 'owner' ? 'Business Assistant' : 'Coach'}
                </Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  <Coins size={12} color={colors.primary} /> {tokens} Tokens left
                </Text>
              </View>
            </View>
            <Pressable onPress={() => setVisible(false)} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.messageRow,
                  msg.role === 'user' ? styles.userRow : styles.assistantRow
                ]}
              >
                {msg.role !== 'user' && (
                  <View style={[styles.msgAvatar, { backgroundColor: msg.role === 'system' ? '#ef444415' : colors.primary + '15' }]}>
                    {msg.role === 'system' ? (
                      <AlertTriangle size={14} color="#ef4444" />
                    ) : (
                      <Bot size={14} color={colors.primary} />
                    )}
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    msg.role === 'user'
                      ? [styles.userBubble, { backgroundColor: colors.primary }]
                      : msg.role === 'system'
                      ? [styles.systemBubble, { borderColor: '#ef444430' }]
                      : [styles.assistantBubble, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
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
              <View style={[styles.messageRow, styles.assistantRow]}>
                <View style={[styles.msgAvatar, { backgroundColor: colors.primary + '15' }]}>
                  <Bot size={14} color={colors.primary} />
                </View>
                <View style={[styles.messageBubble, styles.assistantBubble, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
              {getQuickActions().map((action, i) => (
                <Pressable
                  key={i}
                  onPress={() => handleSend(action)}
                  disabled={tokens <= 0 || loading}
                  style={[styles.quickActionBadge, { borderColor: colors.primary + '40', backgroundColor: colors.primary + '08' }]}
                >
                  <Text style={[styles.quickActionText, { color: colors.primary }]}>{action}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Input Area */}
          <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.backgroundElement }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={tokens > 0 ? "Type a message..." : "0 tokens left..."}
              placeholderTextColor={colors.textSecondary}
              editable={tokens > 0 && !loading}
              style={[styles.textInput, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
            <Pressable
              onPress={() => handleSend()}
              disabled={!input.trim() || tokens <= 0 || loading}
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
            >
              <Send size={18} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 99,
  },
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    padding: 16,
    gap: 16,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  assistantRow: {
    alignSelf: 'flex-start',
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  systemBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    backgroundColor: '#ef444408',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickActionsContainer: {
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#cccccc30',
  },
  quickActionsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickActionBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputContainer: {
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
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
