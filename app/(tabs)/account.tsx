import { View, Text, StyleSheet } from 'react-native';
import { Container } from '../../src/components/Container';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { supabase } from '../../src/lib/supabase';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function AccountScreen() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      
      // Redirect to sign in screen
      router.replace('/(auth)/SignIn');
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Container>
      <Text style={styles.title}>Account Settings</Text>

      <View style={styles.userInfo}>
        <Text style={styles.email}>{userEmail}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="My Account" 
          onPress={() => {}} 
          variant="secondary"
        />
        <Button 
          title={isSigningOut ? "Signing out..." : "Sign out"} 
          onPress={handleSignOut} 
          variant="secondary"
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fonts.ubuntu.bold,
    fontSize: typography.sizes.h1,
    color: colors.text.primary,
    marginBottom: 4,
    paddingTop: 90,
  },
  userInfo: {
    marginTop: 48,
  },
  email: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  buttonContainer: {
    marginTop: 48,
  },
}); 