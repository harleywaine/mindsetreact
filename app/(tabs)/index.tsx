import { useEffect, useState } from 'react'
import { Text, StyleSheet, View, Pressable, ActivityIndicator } from 'react-native'
import { Container } from '../../src/components/Container'
import { colors } from '../../src/theme/colors'
import { typography } from '../../src/theme/typography'
import { CircularButton } from '../../src/components/CircularButton'
import { LessonCard } from '../../src/components/LessonCard'
import { Link } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function HomeScreen() {
  const [foundationLessons, setFoundationLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFoundations = async () => {
      setLoading(true)

      try {
        // Fetch audio files for the specific module
        const { data: audioFiles, error: audioErr } = await supabase
          .from('audio_files')
          .select('id, title, duration')
          .eq('module_id', 'e17bf023-2601-4981-9858-b792532469f6')
          .order('order')

        console.log('Audio files data:', audioFiles, 'Error:', audioErr)

        if (audioErr) {
          console.error('Audio fetch error:', audioErr)
          setFoundationLessons([])
        } else {
          setFoundationLessons(audioFiles || [])
        }
      } catch (error) {
        console.error('Error fetching audio files:', error)
        setFoundationLessons([])
      } finally {
        setLoading(false)
      }
    }

    fetchFoundations()
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor((seconds || 1200) / 60)
    return `${mins} Minute${mins === 1 ? '' : 's'}`
  }

  return (
    <Container>
      <Text style={styles.title}>Welcome back, James</Text>
      <Text style={styles.subtitle}>Let's make some progress</Text>
      
      <Text style={styles.sectionTitle}>Flick the switch</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Link href={{ pathname: "../play", params: { uuid: "91fe8075-69fe-4300-be53-2e32a0c7def4" } }} asChild>
            <Pressable><CircularButton iconName="bolt" size={24} /></Pressable>
          </Link>
          <Text style={styles.buttonLabel}>Switch On</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Link href={{ pathname: "../play", params: { uuid: "b1be2214-b866-4232-a930-5ef50cc116de" } }} asChild>
            <Pressable><CircularButton iconName="battery-full" size={24} /></Pressable>
          </Link>
          <Text style={styles.buttonLabel}>Switch Off</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Link href={{ pathname: "../play", params: { uuid: "b1be2214-b866-4232-a930-5ef50cc116de" } }} asChild>
            <Pressable><CircularButton iconName="shield" size={24} /></Pressable>
          </Link>
          <Text style={styles.buttonLabel}>Take Control</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, styles.foundationsTitle]}>Foundations</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.lessonContainer}>
          {foundationLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title || 'Untitled'}
              duration={formatDuration(lesson.duration)}
              uuid={lesson.id}
            />
          ))}
        </View>
      )}
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
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
})
