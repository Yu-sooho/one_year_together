import React, {memo, useEffect} from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import colors from '../../styles/colors'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import FastImage from 'react-native-fast-image'
import {normalize} from '../../utils'

const iconSize = normalize(52)

const LoadingContainer = memo(() => {
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = withTiming(360 * 1000, {
      duration: 360 * 1000 * 2,
      easing: Easing.linear,
    })
  }, [rotation])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    }
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.square, animatedStyle]}>
        <FastImage
          style={styles.image}
          source={{
            uri: 'data:image/jpeg;base64,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',
          }}
        />
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.c24242480,
    position: 'absolute',
  },
  square: {
    width: iconSize,
    height: iconSize,
    backgroundColor: 'blue',
    borderRadius: iconSize,
  },
  image: {
    width: iconSize,
    height: iconSize,
    backgroundColor: 'blue',
    borderRadius: iconSize,
  },
})

export default LoadingContainer
