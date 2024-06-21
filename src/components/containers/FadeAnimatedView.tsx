import React, {ReactNode, useEffect} from 'react'
import {StyleSheet, View, ViewProps} from 'react-native'
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
    <View style={[styles.container]} {...props}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default FadeAnimatedView
