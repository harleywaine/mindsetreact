import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type MaintenanceCardProps = {
  title: string;
  duration: string;
  onPress: () => void;
};

export function MaintenanceCard({ title, duration, onPress }: MaintenanceCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <FontAwesome name="play" size={16} color={colors.text.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160, // fixed width instead of percentage
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    height: 120, // taller than regular lesson card
    marginRight: 12, // add margin for horizontal scrolling
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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