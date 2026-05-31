import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { MessageSquare, CircleDot, Phone, Settings, Camera, MoreVertical } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.divider,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: Colors.primaryDark || Colors.primary },
        headerTitleStyle: { color: Colors.headerText, fontWeight: '700', fontSize: 20 },
        headerTintColor: Colors.textLight,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'WhatsApp',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 18, marginRight: 16 }}>
              <Camera size={22} color={Colors.textLight} />
              <MoreVertical size={22} color={Colors.textLight} />
            </View>
          ),
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: 'Status',
          tabBarIcon: ({ color, size }) => <CircleDot size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Calls',
          tabBarIcon: ({ color, size }) => <Phone size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
      {/* Hide all house-rental screens */}
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="favorites" options={{ href: null }} />
      <Tabs.Screen name="messages" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}