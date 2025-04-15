import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Container } from '../../src/components/Container'
import { colors } from '../../src/theme/colors'
import { typography } from '../../src/theme/typography'
import { MaintenanceCard } from '../../src/components/MaintenanceCard'
import { LessonCard } from '../../src/components/LessonCard'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

export default function EmotionalScreen() {
  const [basicTrainingLessons, setBasicTrainingLessons] = useState<any[]>([])
  const [maintenanceLessons, setMaintenanceLessons] = useState<any[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [maintenanceLoading, setMaintenanceLoading] = useState(true)

  const fetchCompletionStatus = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId || userError) {
        console.error('User not found or error:', userError)
        return
      }

      const { data: progress, error: progressErr } = await supabase
        .from('lesson_progress')
        .select('audio_file_id')
        .eq('user_id', userId)
        .eq('completed', true)

      if (progressErr) {
        console.error('Progress fetch error:', progressErr)
        return
      }

      const completedIds = progress?.map((p) => p.audio_file_id) || []
      console.log('Fetched completed lesson IDs:', completedIds)
      setCompletedLessonIds(completedIds)
    } catch (error) {
      console.error('Error fetching completion status:', error)
    }
  }

  const fetchBasicTraining = async () => {
    setLoading(true)

    try {
      // Step 1: Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId || userError) {
        console.error('User not found or error:', userError)
        return
      }

      // Step 2: Fetch audio files for the specific module
      const { data: audioFiles, error: audioErr } = await supabase
        .from('audio_files')
        .select('id, title, duration')
        .eq('module_id', 'ef2275ed-5350-4bf4-b11d-0de47233df90')
        .order('order')

      console.log('Audio files data:', audioFiles, 'Error:', audioErr)

      if (audioErr) {
        console.error('Audio fetch error:', audioErr)
        setBasicTrainingLessons([])
        return
      }

      setBasicTrainingLessons(audioFiles || [])
      await fetchCompletionStatus()
    } catch (error) {
      console.error('Error fetching audio files:', error)
      setBasicTrainingLessons([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMaintenance = async () => {
    setMaintenanceLoading(true)

    try {
      // Fetch audio files for the maintenance module
      const { data: audioFiles, error: audioErr } = await supabase
        .from('audio_files')
        .select('id, title, duration')
        .eq('module_id', 'e66c41de-d434-4a06-8d3a-d188f83722fa')
        .order('order')

      console.log('Maintenance audio files data:', audioFiles, 'Error:', audioErr)

      if (audioErr) {
        console.error('Maintenance audio fetch error:', audioErr)
        setMaintenanceLessons([])
      } else {
        setMaintenanceLessons(audioFiles || [])
      }
    } catch (error) {
      console.error('Error fetching maintenance audio files:', error)
      setMaintenanceLessons([])
    } finally {
      setMaintenanceLoading(false)
    }
  }

  useEffect(() => {
    fetchBasicTraining()
    fetchMaintenance()
  }, [])

  // Add focus effect to refetch completion status
  useFocusEffect(
    useCallback(() => {
      fetchCompletionStatus()
    }, [])
  )

  const formatDuration = (seconds: number) => {
    const mins = Math.floor((seconds || 1200) / 60)
    return `${mins} Minute${mins === 1 ? '' : 's'}`
  }

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Emotional Control</Text>
        <Text style={styles.subtitle}>Take control of your emotions</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maintenance</Text>
          {maintenanceLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.maintenanceScroll}
              contentContainerStyle={styles.maintenanceContainer}
            >
              {maintenanceLessons.map((lesson) => (
                <MaintenanceCard
                  key={lesson.id}
                  title={lesson.title || 'Untitled'}
                  duration={formatDuration(lesson.duration)}
                  uuid={lesson.id}
                />
              ))}
            </ScrollView>
          )}
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
                  completed={completedLessonIds.includes(lesson.id)}
                />
              ))}
            </View>
          )}
        </View>
        
        {/* Add padding at the bottom to ensure content is fully scrollable */}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  bottomPadding: {
    height: 40, // Add padding at the bottom for better scrolling experience
  },
}); 