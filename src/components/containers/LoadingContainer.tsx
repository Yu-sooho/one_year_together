import React, {memo, useEffect} from 'react'
import {Dimensions, Image, StyleSheet, View} from 'react-native'
import colors from '../../styles/colors'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import {normalize} from '../../utils'
import {images} from '../../resources'

const iconSize = normalize(48)

const LoadingContainer = memo(() => {
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 700,
        easing: Easing.linear,
      }),
      -1,
      true,
    )
  }, [scale])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    }
  })

  return (
    <View
      style={[
        styles.container,
        {height: Dimensions.get('window').height + 500},
      ]}>
      <Animated.View style={[styles.square, animatedStyle]}>
        <Image
          style={styles.image}
          source={images.loading_image}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingTop: Dimensions.get('window').height / 2,
    alignItems: 'center',
    backgroundColor: colors.c24242480,
    position: 'absolute',
  },
  square: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize,
  },
  image: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize,
    borderColor: colors.cffffff,
    borderWidth: normalize(2),
  },
})

export default LoadingContainer
