import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  Image, Alert, Animated
} from 'react-native';
import { Send, Paperclip, Mic, Smile, Camera, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Message } from '@/types/chat';

interface Props {
  onSend: (text: string) => void;
  replyTo?: Message | null;
  onCancelReply?: () => void;
}

const QUICK_EMOJIS = ['😂', '❤️', '👍', '🙏', '😮', '😢', '🔥', '🎉'];

export default function MessageInput({ onSend, replyTo, onCancelReply }: Props) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    setShowEmoji(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Reply Preview */}
      {replyTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyContent}>
            <Text style={styles.replyLabel}>Replying to {replyTo.senderId === 'currentUser' ? 'yourself' : 'them'}</Text>
            <Text style={styles.replyText} numberOfLines={1}>{replyTo.text}</Text>
          </View>
          <Pressable onPress={onCancelReply}>
            <X size={18} color={Colors.textSecondary} />
          </Pressable>
        </View>
      )}

      {/* Quick Emoji Panel */}
      {showEmoji && (
        <View style={styles.emojiPanel}>
          {QUICK_EMOJIS.map(e => (
            <Pressable key={e} style={styles.emojiBtn} onPress={() => setText(prev => prev + e)}>
              <Text style={styles.emojiText}>{e}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Input Row */}
      <View style={styles.inputRow}>
        <Pressable onPress={() => setShowEmoji(!showEmoji)} style={styles.iconBtn}>
          <Smile size={22} color={Colors.textSecondary} />
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Message"
          placeholderTextColor={Colors.textTertiary}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={5000}
        />

        <Pressable style={styles.iconBtn} onPress={() => Alert.alert('Attach', 'Attachment picker')}>
          <Paperclip size={22} color={Colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={() => Alert.alert('Camera', 'Camera picker')}>
          <Camera size={22} color={Colors.textSecondary} />
        </Pressable>

        {text.trim().length > 0 ? (
          <Pressable style={styles.sendBtn} onPress={handleSend}>
            <Send size={20} color={Colors.textLight} />
          </Pressable>
        ) : (
          <Pressable style={styles.sendBtn} onPressIn={() => Alert.alert('Voice Note', 'Hold to record voice note')}>
            <Mic size={20} color={Colors.textLight} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: Colors.backgroundSecondary },
  replyBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: Colors.background,
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.divider,
  },
  replyContent: { flex: 1 },
  replyLabel: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  replyText: { fontSize: 13, color: Colors.textSecondary },
  emojiPanel: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.divider,
  },
  emojiBtn: { padding: 6 },
  emojiText: { fontSize: 26 },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 6,
    paddingHorizontal: 8, paddingVertical: 8,
  },
  iconBtn: { padding: 6, marginBottom: 2 },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 22,
    paddingHorizontal: 14, paddingVertical: 9,
    fontSize: 15,
    color: Colors.textPrimary,
    maxHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.divider,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 0,
  },
});