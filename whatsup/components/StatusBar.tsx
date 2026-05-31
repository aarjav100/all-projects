import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";
import { User } from "@/types/chat";

interface StatusBarProps {
  user: User;
}

export default function StatusBar({ user }: StatusBarProps) {
  return (
    <View style={styles.container}>
      {user.isOnline ? (
        <View style={styles.statusContainer}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      ) : (
        <Text style={styles.statusText}>
          {user.lastSeen ? `Last seen ${user.lastSeen}` : "Offline"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: Colors.background,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.online,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});