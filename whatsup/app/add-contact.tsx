import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { X, UserPlus, Phone } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { supabase } from '@/lib/supabase';

export default function AddContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for profile with phone:', phone);
      // 1. Search for existing profile with this phone number
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phone)
        .maybeSingle(); // maybeSingle doesn't error on 0 rows

      if (profileError) {
        console.error('Profile search error:', profileError);
        throw profileError;
      }

      let targetUserId = profile?.id;

      // 2. If profile doesn't exist, create one
      if (!targetUserId) {
        console.log('Profile not found, creating new profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { name, phone_number: phone, avatar_url: `https://i.pravatar.cc/150?u=${phone}` }
          ])
          .select()
          .single();
        
        if (createError) {
          console.error('Profile creation error:', createError);
          throw createError;
        }
        targetUserId = newProfile.id;
        console.log('New profile created with ID:', targetUserId);
      } else {
        console.log('Found existing profile with ID:', targetUserId);
      }

      // 3. Create a new chat conversation
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert([{ updated_at: new Date() }])
        .select()
        .single();

      if (chatError) {
        console.error('Chat creation error:', chatError);
        throw chatError;
      }

      // 4. Add participant
      const { error: partError } = await supabase
        .from('chat_participants')
        .insert([
          { chat_id: newChat.id, user_id: targetUserId }
        ]);

      if (partError) {
        console.error('Participant insertion error:', partError);
        throw partError;
      }

      Alert.alert('Success', `Chat with ${name} started!`);
      // Navigate directly into the new chat so user sees it immediately
      router.replace({
        pathname: `/chat/${newChat.id}`,
        params: { name },
      });
    } catch (error: any) {
      console.error('Add Contact Error:', error.message);
      Alert.alert('Error', 'Failed to add contact: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'New Contact',
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={{ marginLeft: 16 }}>
            <X size={24} color={Colors.textPrimary} />
          </Pressable>
        )
      }} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <UserPlus size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Add New Contact</Text>
        <Text style={styles.subtitle}>Enter details to start a conversation</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Phone size={20} color={Colors.textTertiary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            placeholder="Phone Number"
            placeholderTextColor={Colors.textTertiary}
            value={phone}
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />
        </View>

        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleAddContact}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textLight} />
          ) : (
            <Text style={styles.buttonText}>Start Chatting</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 4,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
});
