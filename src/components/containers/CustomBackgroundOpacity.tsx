import React, {ReactNode} from 'react'
import {Dimensions, StyleSheet, View, ViewProps} from 'react-native'
import FadeAnimatedView from './FadeAnimatedView'
import colors from '../../styles/colors'

interface CustomBackgroundOpacityProps extends ViewProps {
  children?: ReactNode
  isWhite?: boolean
  isNoOpacity?: boolean
}

const CustomBackgroundOpacity: React.FC<CustomBackgroundOpacityProps> = ({
  children,
  isNoOpacity,
  isWhite,
  ...props
}) => {
  return (
    <FadeAnimatedView style={styles.container} {...props}>
      <View
        style={[
          styles.background,
          isWhite && styles.whiteBackground,
          isNoOpacity && styles.noOpacityBackground,
        ]}>
        {children}
      </View>
    </FadeAnimatedView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  noOpacityBackground: {
    backgroundColor: colors.c242424,
  },
  whiteBackground: {
    backgroundColor: colors.cffffff80,
  },
  background: {
    backgroundColor: colors.c24242480,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default CustomBackgroundOpacity
