import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../../services';
import { Colors, BorderRadius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }
    try {
      setIsLoading(true);
      await authService.verifyOtp({ email: email!, otp: otpString });
      setOtpVerified(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    try {
      setIsLoading(true);
      await authService.resetPassword({ email: email!, otp: otp.join(''), newPassword });
      Alert.alert('Success', 'Password reset successfully', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.black} />
      </TouchableOpacity>

      <Text style={styles.title}>{otpVerified ? 'New Password' : 'Verify OTP'}</Text>
      <Text style={styles.subtitle}>
        {otpVerified
          ? 'Enter your new password'
          : `Enter the 6-digit code sent to ${email}`}
      </Text>

      {!otpVerified ? (
        <>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={Colors.white} /> : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.gray} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="New password (min. 6 chars)"
              placeholderTextColor={Colors.gray}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={Colors.white} /> : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 24, paddingTop: 60 },
  backButton: { marginBottom: 24, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: Colors.black, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.gray, marginBottom: 32 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  otpInput: {
    width: 48, height: 56, borderRadius: BorderRadius.md, borderWidth: 1,
    borderColor: Colors.mediumGray, textAlign: 'center', fontSize: 22,
    fontWeight: '600', color: Colors.black, backgroundColor: Colors.lightGray,
  },
  otpInputFilled: { borderColor: Colors.primary, backgroundColor: Colors.white },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: Colors.mediumGray, borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGray, height: 56, paddingHorizontal: 16, marginBottom: 24,
  },
  input: { flex: 1, fontSize: 16, color: Colors.black },
  button: {
    height: 56, backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center',
  },
  buttonText: { fontSize: 18, fontWeight: '600', color: Colors.white },
});
