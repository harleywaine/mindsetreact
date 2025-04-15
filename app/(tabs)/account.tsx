import { View, Text, StyleSheet, Button } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../src/lib/supabase'

export default function AccountScreen() {
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.replace('/(auth)/SignIn')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}) 