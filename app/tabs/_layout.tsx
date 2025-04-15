import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'emotional') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'visualisation') {
            iconName = focused ? 'eye' : 'eye-outline';
          } else if (route.name === 'account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
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
      <Tabs.Screen
        name="emotional"
        options={{
          title: 'Emotional',
        }}
      />
      <Tabs.Screen
        name="visualisation"
        options={{
          title: 'Visualisation',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
        }}
      />
    </Tabs>
  );
} 