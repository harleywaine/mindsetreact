import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Container } from '../../src/components/Container'
import { colors } from '../../src/theme/colors'
import { typography } from '../../src/theme/typography'
import { MaintenanceCard } from '../../src/components/MaintenanceCard'
import { LessonCard } from '../../src/components/LessonCard'

export default function VisualisationScreen() {
  return (
    <Container>
      <Text style={styles.title}>Visualisation</Text>
      <Text style={styles.subtitle}>Visualise and embody peak performance</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Maintenance</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.maintenanceScroll}
          contentContainerStyle={styles.maintenanceContainer}
        >
          <MaintenanceCard
            title="Short Session"
            duration="5 Minutes"
          />
          <MaintenanceCard
            title="Medium Session"
            duration="10 Minutes"
          />
          <MaintenanceCard
            title="Long Session"
            duration="15 Minutes"
          />
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Training</Text>
        <View style={styles.lessonContainer}>
          <LessonCard
            title="Introduction"
            duration="20 Minutes"
          />
          <LessonCard
            title="Lesson 1"
            duration="20 Minutes"
          />
          <LessonCard
            title="Lesson 2"
            duration="20 Minutes"
          />
          <LessonCard
            title="Lesson 3"
            duration="20 Minutes"
          />
        </View>
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
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    fontFamily: typography.fonts.ubuntu.medium,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
    marginBottom: 16,
  },
  maintenanceScroll: {
    marginLeft: -16, // compensate for Container padding
  },
  maintenanceContainer: {
    paddingHorizontal: 16, // restore padding for content
  },
  lessonContainer: {
    marginTop: 16,
  },
}); 