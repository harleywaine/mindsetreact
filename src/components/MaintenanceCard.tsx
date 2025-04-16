import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Play } from 'phosphor-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { Link } from 'expo-router';

type MaintenanceCardProps = {
  title: string;
  duration: string;
  uuid: string;
};

export function MaintenanceCard({ title, duration, uuid }: MaintenanceCardProps) {
  return (
    <Link 
      href={{
        pathname: '/play',
        params: { uuid },
      }}
      asChild
    >
      <Pressable style={styles.container}>
        <View style={styles.iconOuterContainer}>
          <View style={styles.iconCircleContainer}>
            <Play 
              size={16} 
              color="#FFFFFF" 
              weight="fill" 
              style={{ marginLeft: 0 }}
            />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    height: 120,
    marginRight: 12,
  },
  iconOuterContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#1D1D1D',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2B6D79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fonts.ubuntu.medium,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    marginBottom: 4,
  },
  duration: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.tiny,
    color: colors.text.secondary,
  },
}); 