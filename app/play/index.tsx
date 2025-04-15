import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '../../src/components/Container';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function PlayScreen() {
  return (
    <Container>
      <View style={styles.header}>
        <Link href=".." style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color={colors.text.primary} />
        </Link>
      </View>

      <View style={styles.content}>
        <View style={styles.artwork}>
          {/* Placeholder for session artwork */}
          <View style={styles.artworkImage} />
        </View>

        <View style={styles.sessionInfo}>
          <Text style={styles.title}>Short Session</Text>
          <Text style={styles.subtitle}>Emotional Control Training</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.waveform}>
            {/* Placeholder for waveform visualization */}
            <View style={styles.waveformBar} />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>3:43</Text>
            <Text style={styles.timeText}>7:11</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <FontAwesome name="rotate-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton}>
            <FontAwesome name="pause" size={32} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <FontAwesome name="rotate-right" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
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
    width: '50%',
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
}); 