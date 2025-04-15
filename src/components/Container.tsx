import { View, ViewStyle, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

interface ContainerProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function Container({ children, style }: ContainerProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
}) 