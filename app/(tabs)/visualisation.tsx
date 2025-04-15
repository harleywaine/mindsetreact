import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Container } from '../../src/components/Container'
import { colors } from '../../src/theme/colors'
import { typography } from '../../src/theme/typography'
import { MaintenanceCard } from '../../src/components/MaintenanceCard'
import { LessonCard } from '../../src/components/LessonCard'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function VisualisationScreen() {
  const [basicTrainingLessons, setBasicTrainingLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBasicTraining = async () => {
      setLoading(true)

      try {
        // Fetch audio files for the specific module
        const { data: audioFiles, error: audioErr } = await supabase
          .from('audio_files')
          .select('id, title, duration')
          .eq('module_id', '5d99b98d-3593-4f34-be12-60f46ede0833')
          .order('order')

        console.log('Audio files data:', audioFiles, 'Error:', audioErr)

        if (audioErr) {
          console.error('Audio fetch error:', audioErr)
          setBasicTrainingLessons([])
        } else {
          setBasicTrainingLessons(audioFiles || [])
        }
      } catch (error) {
        console.error('Error fetching audio files:', error)
        setBasicTrainingLessons([])
      } finally {
        setLoading(false)
      }
    }

    fetchBasicTraining()
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor((seconds || 1200) / 60)
    return `${mins} Minute${mins === 1 ? '' : 's'}`
  }

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
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.lessonContainer}>
            {basicTrainingLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                title={lesson.title || 'Untitled'}
                duration={formatDuration(lesson.duration)}
                uuid={lesson.id}
              />
            ))}
          </View>
        )}
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
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
}); 