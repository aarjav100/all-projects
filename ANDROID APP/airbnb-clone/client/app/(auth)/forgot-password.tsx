import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../../services';
import { Colors, BorderRadius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    try {
      setIsLoading(true);
      await authService.forgotPassword(email.trim());
      Alert.alert('OTP Sent', 'Check your email for the verification code');
      router.push({ pathname: '/(auth)/verify-otp', params: { email: email.trim() } });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.black} />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we'll send you a verification code to reset your password.
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color={Colors.gray} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={Colors.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !email && styles.disabledButton]}
        onPress={handleSendOTP}
        disabled={isLoading || !email}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.buttonText}>Send verification code</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 24, paddingTop: 60 },
  backButton: { marginBottom: 24, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: Colors.black, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.gray, marginBottom: 32, lineHeight: 24 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.mediumGray,
    borderRadius: BorderRadius.md, backgroundColor: Colors.lightGray,
    height: 56, paddingHorizontal: 16, marginBottom: 24,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: Colors.black },
  button: {
    height: 56, backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center',
  },
  disabledButton: { opacity: 0.6 },
  buttonText: { fontSize: 18, fontWeight: '600', color: Colors.white },
});
