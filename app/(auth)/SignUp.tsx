import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors } from '../../src/theme/colors'
import { typography } from '../../src/theme/typography'
import { Container } from '../../src/components/Container'
import { FontAwesome } from '@expo/vector-icons'

export default function SignUpScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [stage, setStage] = useState<'enter' | 'verify'>('enter')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.')
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) {
        console.error('🔴 OTP send error:', error)
        Alert.alert('Error', error.message)
        return
      }

      Alert.alert('Code Sent', 'Check your Mailtrap inbox for a 6-digit code.')
      setStage('verify')
    } catch (err) {
      console.error('🔴 OTP error:', err)
      Alert.alert('Unexpected Error', 'Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Missing Code', 'Please enter the 6-digit code.')
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

      if (error) {
        console.error('🔴 OTP verify error:', error)
        Alert.alert('Verification Failed', error.message)
        return
      }

      // ✅ Set the password now that OTP is confirmed
      const { error: pwError } = await supabase.auth.updateUser({
        password,
      })

      if (pwError) {
        console.error('🔴 Password update error:', pwError)
        Alert.alert('Password Error', pwError.message)
        return
      }

      Alert.alert('Welcome!', 'Account verified and password set.')
      router.replace('/(tabs)')
    } catch (err) {
      console.error('🔴 General error:', err)
      Alert.alert('Unexpected Error', 'Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Check Mailtrap for your sign-in code</Text>
        </View>

        <View style={styles.form}>
          {stage === 'enter' ? (
            <>
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create Password"
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Sending code...' : 'Send Sign-Up Code'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <FontAwesome name="key" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor={colors.text.secondary}
                  keyboardType="numeric"
                  value={otp}
                  onChangeText={setOtp}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Verifying...' : 'Verify and Finish'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontFamily: typography.fonts.ubuntu.bold,
    fontSize: typography.sizes.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    paddingVertical: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: typography.fonts.ubuntu.bold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
})
