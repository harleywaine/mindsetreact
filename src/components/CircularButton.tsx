import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type CircularButtonProps = {
  iconName: keyof typeof FontAwesome.glyphMap;
  onPress?: () => void;
  size?: number;
};

export function CircularButton({ iconName, onPress, size = 24 }: CircularButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={!onPress}>
      <FontAwesome name={iconName} size={size} color={colors.text.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 10,
    borderColor: '#333537',
  },
}); 