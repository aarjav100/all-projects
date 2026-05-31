import React from 'react';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerStyle: { backgroundColor: Colors.background }, headerTintColor: Colors.textPrimary, headerTitleStyle: { fontWeight: '700' } }}>
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      <Stack.Screen name="property/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="add-property" options={{ headerShown: true, title: 'List Property', animation: 'slide_from_bottom', presentation: 'modal' }} />
      <Stack.Screen name="add-contact" options={{ headerShown: true, title: 'New Contact', presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: true, animation: 'slide_from_right' }} />
    </Stack>
  );
}