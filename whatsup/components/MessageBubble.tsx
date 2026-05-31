import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Check, CheckCheck, Mic } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Message } from '@/types/chat';

interface Props {
  message: Message;
  isFromCurrentUser: boolean;
  onLongPress?: (message: Message) => void;
  onReply?: (message: Message) => void;
}

const REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

export default function MessageBubble({ message, isFromCurrentUser, onLongPress, onReply }: Props) {
  const isVoice = message.type === 'voice';
  const isImage = message.type === 'image';

  return (
    <Pressable
      onLongPress={() => onLongPress?.(message)}
      style={[styles.row, isFromCurrentUser && styles.rowReverse]}
    >
      <View style={[
        styles.bubble,
        isFromCurrentUser ? styles.outgoing : styles.incoming,
        isImage && styles.imageBubble,
      ]}>
        {/* Reply preview */}
        {message.replyTo && (
          <View style={styles.replyQuote}>
            <Text style={styles.replyQuoteLabel}>{message.replyTo.senderName}</Text>
            <Text style={styles.replyQuoteText} numberOfLines={1}>{message.replyTo.text}</Text>
          </View>
        )}

        {/* Image message */}
        {isImage && message.mediaUrl && (
          <Image
            source={{ uri: message.mediaUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Voice note */}
        {isVoice ? (
          <View style={styles.voice}>
            <View style={styles.voicePlayBtn}>
              <Mic size={14} color={Colors.textLight} />
            </View>
            <View style={styles.waveform}>
              {[4, 8, 14, 10, 6, 12, 9, 5, 11, 7].map((h, i) => (
                <View key={i} style={[styles.bar, { height: h * 2 }]} />
              ))}
            </View>
            <Text style={styles.voiceDuration}>{message.duration || 0}s</Text>
          </View>
        ) : (
          /* Text */
          !isImage && (
            <Text style={[styles.text, isFromCurrentUser ? styles.textOut : styles.textIn]}>
              {message.text}
            </Text>
          )
        )}

        {/* Caption for image */}
        {isImage && message.text && message.text !== '📷 Photo' && (
          <Text style={[styles.text, styles.caption]}>{message.text}</Text>
        )}

        {/* Footer */}
        <View style={[styles.footer, isFromCurrentUser && styles.footerOut]}>
          <Text style={styles.time}>{message.timestamp}</Text>
          {isFromCurrentUser && (
            message.isRead
              ? <CheckCheck size={14} color={Colors.read} />
              : <Check size={14} color={Colors.textTertiary} />
          )}
        </View>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <View style={styles.reactions}>
            {message.reactions.map((r, i) => (
              <Text key={i} style={styles.reaction}>{r.emoji}</Text>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 2, paddingHorizontal: 10 },
  rowReverse: { flexDirection: 'row-reverse' },
  bubble: {
    maxWidth: '80%', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 2, elevation: 1,
  },
  outgoing: { backgroundColor: Colors.outgoingBubble, borderTopRightRadius: 2 },
  incoming: { backgroundColor: Colors.incomingBubble, borderTopLeftRadius: 2 },
  imageBubble: { padding: 3, paddingBottom: 0 },
  replyQuote: {
    backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 8, borderLeftWidth: 3,
    borderLeftColor: Colors.primary, padding: 6, marginBottom: 6,
  },
  replyQuoteLabel: { fontSize: 12, fontWeight: '700', color: Colors.primary, marginBottom: 2 },
  replyQuoteText: { fontSize: 12, color: Colors.textSecondary },
  image: { width: 220, height: 180, borderRadius: 10 },
  text: { fontSize: 15, lineHeight: 20 },
  textOut: { color: Colors.textPrimary },
  textIn: { color: Colors.textPrimary },
  caption: { color: Colors.textPrimary, paddingHorizontal: 4, paddingTop: 4 },
  voice: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  voicePlayBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  bar: { width: 3, backgroundColor: Colors.primary, borderRadius: 2 },
  voiceDuration: { fontSize: 12, color: Colors.textSecondary },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, justifyContent: 'flex-start' },
  footerOut: { justifyContent: 'flex-end' },
  time: { fontSize: 11, color: Colors.textTertiary },
  reactions: { flexDirection: 'row', gap: 2, marginTop: 4 },
  reaction: { fontSize: 14 },
});