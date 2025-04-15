import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import * as Font from 'expo-font';

export default function TabLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      Font.loadAsync(FontAwesome.font);
    }
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          return <FontAwesome name="home" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
    </Tabs>
  );
} 