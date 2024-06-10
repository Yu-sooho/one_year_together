import React, {ReactNode, useEffect} from 'react'
import {StyleProp, StyleSheet, ViewProps, ViewStyle} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

interface AnimatedViewProps extends ViewProps {
  children?: ReactNode
}

const FadeAnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  ...props
}) => {
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 500})
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  return (
    <Animated.View style={[styles.container]} {...props}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default FadeAnimatedView
