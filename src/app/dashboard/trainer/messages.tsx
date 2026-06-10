import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, useColorScheme, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Send, User } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainerMessagesScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'client', text: 'Hey Coach, should I stick to the 80kg bench press weight today?' },
    { id: 2, sender: 'trainer', text: 'Yes Alex, stay at 80kg. Focus on explosive push from bottom. Keep rest periods under 2 minutes.' }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'trainer', text: input }]);
    setInput('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
            <User size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.clientName, { color: colors.text }]}>Alex Gymer</Text>
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>Active member • Muscle Gain</Text>
          </View>
        </View>

        {/* Chats */}
        <ScrollView contentContainerStyle={styles.chatsContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.msgRow,
                msg.sender === 'trainer' ? styles.trainerRow : styles.clientRow
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  msg.sender === 'trainer'
                    ? [styles.trainerBubble, { backgroundColor: colors.primary }]
                    : [styles.clientBubble, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]
                ]}
              >
                <Text
                  style={{
                    color: msg.sender === 'trainer'
                      ? (scheme === 'dark' ? '#000000' : '#ffffff')
                      : colors.text,
                    fontSize: 14,
                    lineHeight: 20
                  }}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputBox, { borderTopColor: colors.border, backgroundColor: colors.backgroundElement }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.textInput, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim()}
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
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  chatsContainer: {
    padding: 16,
    gap: 14,
    flexGrow: 1,
  },
  msgRow: {
    maxWidth: '80%',
  },
  trainerRow: {
    alignSelf: 'flex-end',
  },
  clientRow: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  trainerBubble: {
    borderBottomRightRadius: 2,
  },
  clientBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  inputBox: {
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
