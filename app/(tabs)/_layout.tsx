import { Tabs } from 'expo-router';
import { House, Heart, Eye, User } from 'phosphor-react-native';
import { colors } from '../../src/theme/colors';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.dark,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 98 : 78,
          paddingBottom: Platform.OS === 'ios' ? 32 : 16,
          paddingTop: 16,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: 8,
          marginTop: -12,
        },
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <View style={{
              backgroundColor: focused ? '#2B6D79' : 'transparent',
              borderRadius: 24,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {/* Icon will be rendered here by individual tab options */}
            </View>
          );
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#2B6D79' : 'transparent',
              borderRadius: 24,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <House size={29} color={color} weight="regular" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="emotional"
        options={{
          title: 'Emotional',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#2B6D79' : 'transparent',
              borderRadius: 24,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Heart size={29} color={color} weight="regular" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="visualisation"
        options={{
          title: 'Visualisation',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#2B6D79' : 'transparent',
              borderRadius: 24,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Eye size={29} color={color} weight="regular" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#2B6D79' : 'transparent',
              borderRadius: 24,
              padding: 8,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <User size={29} color={color} weight="regular" />
            </View>
          ),
        }}
      />
    </Tabs>
  );
} 