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
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emotional"
        options={{
          title: 'Emotional',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="visualisation"
        options={{
          title: 'Visualisation',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="eye" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 