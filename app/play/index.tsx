import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Container } from '../../src/components/Container'
import { colors } from '../../src/theme/colors'
import { typography } from '../../src/theme/typography'
import { FontAwesome } from '@expo/vector-icons'
import { Link, useLocalSearchParams } from 'expo-router'
import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function PlayScreen() {
  const { uuid } = useLocalSearchParams()
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState('Audio Session')
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAudio()
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [uuid])

  const loadAudio = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!uuid || typeof uuid !== 'string') {
        setError('Missing or invalid audio ID.')
        return
      }

      console.log('Loading audio file for ID:', uuid)

      const { data: audioFile, error: audioError } = await supabase
        .from('audio_files')
        .select('url, title')
        .eq('id', uuid)
        .single()

      if (audioError || !audioFile?.url) {
        console.error('Audio DB fetch error:', audioError)
        setError('Audio file not found.')
        return
      }

      const publicUrl = audioFile.url
      setTitle(audioFile.title || 'Audio Session')

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      })

      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: publicUrl },
        {
          shouldPlay: false,
          progressUpdateIntervalMillis: 1000,
        },
        onPlaybackStatusUpdate
      )

      setSound(audioSound)

      const status = await audioSound.getStatusAsync()
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0)
        setPosition(status.positionMillis || 0)
      }

    } catch (error) {
      console.error('Audio load error:', error)
      setError('Failed to load audio.')
    } finally {
      setIsLoading(false)
    }
  }

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis)
      setIsPlaying(status.isPlaying)
      if (status.didJustFinish) {
        setIsPlaying(false)
        sound?.setPositionAsync(0)
      }
    }
  }

  const togglePlayback = async () => {
    if (!sound) return
    try {
      if (isPlaying) {
        await sound.pauseAsync()
      } else {
        await sound.playAsync()
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error('Playback toggle error:', error)
      setError('Failed to play/pause audio')
    }
  }

  const skipBackward = async () => {
    if (!sound) return
    try {
      const newPosition = Math.max(0, position - 10000)
      await sound.setPositionAsync(newPosition)
    } catch (error) {
      console.error('Skip back error:', error)
    }
  }

  const skipForward = async () => {
    if (!sound) return
    try {
      const newPosition = Math.min(duration, position + 10000)
      await sound.setPositionAsync(newPosition)
    } catch (error) {
      console.error('Skip forward error:', error)
    }
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (position / duration) * 100 : 0

  return (
    <Container>
      <View style={styles.header}>
        <Link href=".." style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color={colors.text.primary} />
        </Link>
      </View>

      <View style={styles.content}>
        <View style={styles.artwork}>
          <View style={styles.artworkImage} />
        </View>

        <View style={styles.sessionInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Emotional Control Training</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.waveform}>
            <View style={[styles.waveformBar, { width: `${progress}%` }]} />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
            <FontAwesome name="rotate-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading audio...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayback}
              disabled={!sound}
            >
              <FontAwesome
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
            <FontAwesome name="rotate-right" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  artwork: {
    width: 200,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  artworkImage: {
    flex: 1,
    backgroundColor: colors.primary,
    borderBottomWidth: 60,
    borderBottomColor: 'white',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  sessionInfo: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: typography.fonts.ubuntu.bold,
    fontSize: typography.sizes.h2,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 48,
  },
  waveform: {
    height: 40,
    backgroundColor: colors.background.card,
    borderRadius: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },
  waveformBar: {
    height: '100%',
    backgroundColor: colors.primary,
    opacity: 0.5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontFamily: typography.fonts.ubuntu.regular,
    fontSize: typography.sizes.small,
    color: colors.text.secondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
})
