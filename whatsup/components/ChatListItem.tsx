import { useRouter } from "expo-router";
import { Check, CheckCheck, Zap } from "lucide-react-native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { Chat } from "@/types/chat";

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
}

export default function ChatListItem({ chat, currentUserId }: ChatListItemProps) {
  const router = useRouter();
  const { user, lastMessage, unreadCount } = chat;

  const handlePress = () => {
    router.push({
      pathname: `/chat/${chat.id}`,
      params: { name: user.name }
    });
  };

  const isLastMessageFromMe = lastMessage?.senderId === currentUserId;
  const isGrokChat = chat.id === "grok-ai";

  const formatPhoneNumber = (phone: string) => {
    if (phone.includes("AI")) return phone;
    return phone.replace(/\D/g, '').replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
  };

  return (
    <Pressable 
      style={[styles.container, isGrokChat && styles.grokContainer]} 
      onPress={handlePress}
      android_ripple={{ color: Colors.divider }}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        {isGrokChat ? (
          <LinearGradient
            colors={["#FF6B35", "#F7931E"]}
            style={styles.grokIndicator}
          >
            <Zap size={12} color={Colors.textLight} strokeWidth={3} />
          </LinearGradient>
        ) : user.isOnline ? (
          <LinearGradient
            colors={[Colors.online, Colors.primaryDark]}
            style={styles.onlineIndicator}
          />
        ) : null}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, isGrokChat && styles.grokName]} numberOfLines={1}>
              {user.name}
            </Text>
            {isGrokChat && (
              <LinearGradient
                colors={["#FF6B35", "#F7931E"]}
                style={styles.aiBadge}
              >
                <Text style={styles.aiBadgeText}>AI</Text>
              </LinearGradient>
            )}
          </View>
          <Text style={styles.time}>{lastMessage?.timestamp}</Text>
        </View>
        
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneNumber}>{formatPhoneNumber(user.phoneNumber)}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <View style={styles.messageTextContainer}>
            {isLastMessageFromMe && (
              <View style={styles.statusContainer}>
                {lastMessage?.isRead ? (
                  <CheckCheck size={16} color={Colors.read} strokeWidth={2.5} />
                ) : (
                  <Check size={16} color={Colors.textSecondary} strokeWidth={2} />
                )}
              </View>
            )}
            <Text 
              style={[
                styles.message, 
                unreadCount > 0 && !isLastMessageFromMe && styles.unreadMessage
              ]} 
              numberOfLines={1}
            >
              {lastMessage?.text}
            </Text>
          </View>
          
          {unreadCount > 0 && !isLastMessageFromMe && (
            <LinearGradient
              colors={isGrokChat ? ["#FF6B35", "#F7931E"] : Colors.primaryGradient}
              style={styles.unreadBadge}
            >
              <Text style={styles.unreadCount}>{unreadCount}</Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: Colors.background,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  grokContainer: {
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
    shadowColor: "#FF6B35",
    shadowOpacity: 0.15,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: Colors.background,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  grokIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  grokName: {
    color: "#FF6B35",
  },
  aiBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontWeight: "600",
  },
  phoneContainer: {
    marginBottom: 6,
  },
  phoneNumber: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusContainer: {
    marginRight: 8,
  },
  message: {
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  unreadMessage: {
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  unreadBadge: {
    borderRadius: 14,
    minWidth: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadCount: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 6,
  },
});