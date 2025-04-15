import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { Link } from 'expo-router';

type LessonCardProps = {
  title: string;
  duration: string;
  uuid: string;
};

export function LessonCard({ title, duration, uuid }: LessonCardProps) {
  return (
    <Link
      href={{
        pathname: '/play',
        params: { uuid },
      }}
      asChild
    >
      <Pressable style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome name="play" size={16} color={colors.text.primary} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.duration}>{duration}</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.text.secondary} />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
