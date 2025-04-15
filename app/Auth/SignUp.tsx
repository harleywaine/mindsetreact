// app/Auth/SignUp.tsx

import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function SignUpScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        Alert.alert('Sign Up Error', error.message)
      } else if (data.session) {
        Alert.alert('Success', 'Check your email to confirm your account.')
        router.replace('/Auth/SignIn')
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <Button 
        title={loading ? "Signing up..." : "Sign Up"} 
        onPress={handleSignUp}
        disabled={loading}
      />

      <Text style={styles.link} onPress={() => router.push('/Auth/SignIn')}>
        Already have an account? Sign In
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8 },
  link: { marginTop: 16, color: '#1e90ff', textAlign: 'center' },
})
