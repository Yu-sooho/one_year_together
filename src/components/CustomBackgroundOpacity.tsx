import React, {ReactNode, memo, useCallback, useEffect} from 'react'
import {Dimensions, StyleSheet, Text, View, ViewProps} from 'react-native'
import FadeAnimatedView from './FadeAnimatedView'
import colors from '../styles/colors'

interface CustomBackgroundOpacityProps extends ViewProps {
  children?: ReactNode
}

const CustomBackgroundOpacity: React.FC<CustomBackgroundOpacityProps> = ({
  children,
  ...props
}) => {
  return (
    <FadeAnimatedView style={styles.container} {...props}>
      <View style={styles.background}>{children}</View>
    </FadeAnimatedView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
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
