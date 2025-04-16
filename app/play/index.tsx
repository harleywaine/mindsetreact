import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import { Container } from '../../src/components/Container'
import { colors } from '../../src/theme/colors'
import { typography } from '../../src/theme/typography'
import { FontAwesome } from '@expo/vector-icons'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { Audio } from 'expo-av'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import * as React from 'react'

export default function PlayScreen() {
  const router = useRouter()
  const { uuid } = useLocalSearchParams()
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState('Audio Session')
  const [moduleTitle, setModuleTitle] = useState('')
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const cleanup = useCallback(async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync()
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.stopAsync()
          }
          await sound.unloadAsync()
        }
      } catch (error) {
        console.error('Error cleaning up audio:', error)
      }
    }
  }, [sound])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      cleanup()
      return false
    })

    return () => {
      backHandler.remove()
      cleanup()
    }
  }, [cleanup])

  useEffect(() => {
    const getUserAndLoad = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (data?.user?.id) {
          setUserId(data.user.id)
          console.log('User authenticated:', data.user.id)
          
          // Test access to lesson_progress table
          const { data: testData, error: testError } = await supabase
            .from('lesson_progress')
            .select('*')
            .limit(1)
          
          console.log('Test access to lesson_progress table:', testData, testError)
        } else {
          console.error('User not authenticated:', error)
          // Try to refresh the session
          const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession()
          if (sessionData?.user?.id) {
            setUserId(sessionData.user.id)
            console.log('User authenticated after refresh:', sessionData.user.id)
          } else {
            console.error('Failed to refresh session:', sessionError)
          }
        }
      } catch (e) {
        console.error('Error getting user:', e)
      }
      await loadAudio()
    }

    getUserAndLoad()
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

      // First get the audio file info
      const { data: audioFile, error: audioError } = await supabase
        .from('audio_files')
        .select('url, title, module_id')
        .eq('id', uuid)
        .single()

      if (audioError || !audioFile?.url) {
        console.error('Audio DB fetch error:', audioError)
        setError('Audio file not found.')
        return
      }

      // Then get the module title
      if (audioFile.module_id) {
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('title')
          .eq('id', audioFile.module_id)
          .single()

        if (!moduleError && moduleData) {
          setModuleTitle(moduleData.title)
        }
      }

      const publicUrl = audioFile.url
      console.log('Audio URL:', publicUrl)
      setTitle(audioFile.title)

      await cleanup()

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      })

      console.log('Creating new sound object')
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: publicUrl },
        {
          shouldPlay: false,
          progressUpdateIntervalMillis: 1000,
          positionMillis: 0,
          rate: 1.0,
          shouldCorrectPitch: true,
          volume: 1.0,
          isMuted: false,
        },
        onPlaybackStatusUpdate
      )

      console.log('Sound object created')
      setSound(audioSound)

      const status = await audioSound.getStatusAsync()
      console.log('Initial sound status:', status)

      if (status.isLoaded) {
        setDuration(status.durationMillis || 0)
        setPosition(status.positionMillis || 0)
      } else {
        console.error('Sound not loaded properly:', status)
        setError('Failed to load audio properly')
      }

    } catch (error) {
      console.error('Audio load error:', error)
      setError('Failed to load audio.')
    } finally {
      setIsLoading(false)
    }
  }

  const onPlaybackStatusUpdate = async (status: any) => {
    console.log('Playback status:', status)

    if (status.isLoaded) {
      setPosition(status.positionMillis)
      setIsPlaying(status.isPlaying)

      if (status.didJustFinish) {
        console.log('Audio playback just finished')
        setIsPlaying(false)
        sound?.setPositionAsync(0)

        console.log('Attempting to mark lesson as complete')
        console.log('User ID:', userId)
        console.log('Audio File ID (UUID):', uuid)
        
        // If userId is null, try to get it again
        let currentUserId = userId
        if (!currentUserId) {
          console.log('User ID is null, attempting to retrieve it again')
          const { data, error } = await supabase.auth.getUser()
          if (data?.user?.id) {
            currentUserId = data.user.id
            setUserId(currentUserId)
            console.log('Retrieved user ID:', currentUserId)
          } else {
            console.error('Failed to retrieve user ID:', error)
          }
        }
        
        if (currentUserId && typeof uuid === 'string') {
          console.log('Both userId and uuid are valid, proceeding with upsert')
          
          try {
            // First check if the lesson is already marked as complete
            const { data: existingData, error: checkError } = await supabase
              .from('lesson_progress')
              .select('completed')
              .eq('user_id', currentUserId)
              .eq('audio_file_id', uuid)
              .single()
            
            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
              console.error('Error checking lesson status:', checkError)
            } else if (existingData?.completed) {
              console.log('✅ Lesson already marked as complete in Supabase')
              return
            }
            
            // If not already complete, mark it as complete
            const { data, error } = await supabase.from('lesson_progress').upsert({
              user_id: currentUserId,
              audio_file_id: uuid,
              completed: true,
            })
            
            console.log('Upsert response data:', data)
            
            if (error) {
              // Check if it's a duplicate key error
              if (error.code === '23505') {
                console.log('✅ Lesson already marked as complete in Supabase (duplicate key)')
              } else {
                console.error('Error marking lesson complete:', error)
                console.error('Error details:', JSON.stringify(error))
              }
            } else {
              console.log('✅ Lesson marked as complete in Supabase')
            }
          } catch (e) {
            console.error('Exception during upsert:', e)
          }
        } else {
          console.error('Missing required data for marking lesson complete:')
          console.error('userId is valid:', !!currentUserId)
          console.error('uuid is valid string:', typeof uuid === 'string')
        }
      }
    } else if (status.error) {
      console.error('Playback error:', status.error)
      setError('Playback error occurred')
    }
  }

  const togglePlayback = async () => {
    if (!sound) {
      console.error('No sound object available')
      return
    }

    try {
      const status = await sound.getStatusAsync()
      console.log('Current status before toggle:', status)

      if (!status.isLoaded) {
        console.error('Sound not loaded properly')
        return
      }

      if (status.isPlaying) {
        console.log('Attempting to pause')
        await sound.pauseAsync()
        setIsPlaying(false)
      } else {
        console.log('Attempting to play')
        await sound.playAsync()
        setIsPlaying(true)
      }

      const newStatus = await sound.getStatusAsync()
      console.log('Status after toggle:', newStatus)
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

  const handleBackPress = async () => {
    await cleanup()
    router.back()
  }

  return (
    <Container>
      <View style={styles.header}>
        <Link href="../" asChild>
          <TouchableOpacity onPress={handleBackPress}>
            <FontAwesome name="chevron-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.content}>
        <View style={styles.artwork}>
          <View style={styles.artworkImage} />
        </View>

        <View style={styles.sessionInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{moduleTitle}</Text>
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
