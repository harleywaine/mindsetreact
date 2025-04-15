import { View, Text, StyleSheet } from 'react-native';
import { Container } from '../../src/components/Container';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { supabase } from '../../src/lib/supabase';
import { useEffect, useState } from 'react';

export default function AccountScreen() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    };
    getUser();
  }, []);

  return (
    <Container>
      <Text style={styles.title}>Account</Text>

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
          title="Sign out" 
          onPress={() => {}} 
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
    paddingTop: 60,
  },
  userInfo: {
    marginTop: 32,
  },
  email: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  buttonContainer: {
    marginTop: 32,
  },
}); 