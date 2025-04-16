import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { CheckCircle, Play } from 'phosphor-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { Link } from 'expo-router';

type LessonCardProps = {
  title: string;
  duration: string;
  uuid: string;
  completed?: boolean;
};

export function LessonCard({ title, duration, uuid, completed = false }: LessonCardProps) {
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
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.duration}>{duration}</Text>
          </View>

          {completed && (
            <View style={styles.completedContainer}>
              <View style={styles.checkContainer}>
                <CheckCircle
                  size={24}
                  color="#FFFFFF"
                  weight="regular"
                />
              </View>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    padding: 12,
    alignItems: 'flex-start',
    gap: 2,
    borderRadius: 8,
    backgroundColor: '#333537',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 5, // for Android shadow
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconOuterContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#1D1D1D',
    marginRight: 12,
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
    marginRight: 12,
  },
  title: {
    fontFamily: typography.fonts.ubuntu.medium,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  duration: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: 14,
    color: '#9CA3AF',
  },
  completedContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2B6D79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkContainer: {
    padding: 2,
  },
});
