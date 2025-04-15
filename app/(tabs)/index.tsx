import { Text, StyleSheet, View, Pressable } from 'react-native'
import { Container } from '../../src/components/Container'
import { colors } from '../../src/theme/colors'
import { typography } from '../../src/theme/typography'
import { CircularButton } from '../../src/components/CircularButton'
import { LessonCard } from '../../src/components/LessonCard'
import { Link } from 'expo-router'

export default function HomeScreen() {
  return (
    <Container>
      <Text style={styles.title}>Welcome back, James</Text>
      <Text style={styles.subtitle}>Let's make some progress</Text>
      
      <Text style={styles.sectionTitle}>Flick the switch</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Link href={{
            pathname: "../play",
            params: { uuid: "91fe8075-69fe-4300-be53-2e32a0c7def4" }
          }} asChild>
            <Pressable>
              <CircularButton 
                iconName="bolt" 
                size={24}
              />
            </Pressable>
          </Link>
          <Text style={styles.buttonLabel}>Switch On</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Link href={{
            pathname: "../play",
            params: { uuid: "a2b4c6d8-e0f2-4444-8888-1234567890ab" }
          }} asChild>
            <Pressable>
              <CircularButton 
                iconName="battery-full" 
                size={24}
              />
            </Pressable>
          </Link>
          <Text style={styles.buttonLabel}>Switch Off</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Link href={{
            pathname: "../play",
            params: { uuid: "f9e8d7c6-b5a4-3333-7777-9876543210cd" }
          }} asChild>
            <Pressable>
              <CircularButton 
                iconName="shield" 
                size={24}
              />
            </Pressable>
          </Link>
          <Text style={styles.buttonLabel}>Take Control</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, styles.foundationsTitle]}>Foundations</Text>
      <View style={styles.lessonContainer}>
        <LessonCard
          title="Visualise the Race"
          duration="20 Minutes"
        />
        <LessonCard
          title="Confident Behaviour"
          duration="20 Minutes"
        />
        <LessonCard
          title="Training Breakthroughs"
          duration="20 Minutes"
        />
        <LessonCard
          title="Overcoming Obstacles"
          duration="20 Minutes"
        />
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fonts.ubuntu.bold,
    fontSize: typography.sizes.h1,
    color: colors.text.primary,
    marginBottom: 4,
    paddingTop: 60,
  },
  subtitle: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontFamily: typography.fonts.ubuntu.medium,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
    marginTop: 60,
    marginBottom: 16,
  },
  foundationsTitle: {
    marginTop: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  buttonLabel: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.tiny,
    color: colors.text.secondary,
    marginTop: 8,
  },
  lessonContainer: {
    // removing paddingHorizontal to align with container edges
  },
}); 