import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
};

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        variant === 'secondary' && styles.containerSecondary
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.text,
        variant === 'secondary' && styles.textSecondary
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  containerSecondary: {
    backgroundColor: colors.background.card,
  },
  text: {
    fontFamily: typography.fonts.ubuntu.medium,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  textSecondary: {
    color: colors.text.secondary,
  },
}); 