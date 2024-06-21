import React from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import {MainScreenHeaderProps} from '../../types/ComponentTypes'
import colors from '../../styles/colors'
import {MAIN_HEADER_MAX_SIZE, MAIN_HEADER_MIN_SIZE} from '../../styles/const'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import {normalize} from '../../utils'

const MainScreenHeader: React.FC<MainScreenHeaderProps> = ({
  eventList,
  scrollY,
}) => {
  const inset = useSafeAreaInsets()

  const dateAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      Extrapolate.CLAMP,
    )
    return {
      transform: [{translateY}],
    }
  })

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      Extrapolate.CLAMP,
    )
    return {
      transform: [{translateY}],
    }
  })

  const componentStyles = StyleSheet.create({
    container: {
      height: MAIN_HEADER_MAX_SIZE + inset.top,
    },
    content: {height: inset.top},
  })

  return (
    <View style={[styles.container, componentStyles.container]}>
      <View style={componentStyles.content} />
      <View style={styles.headerStyle}>
        <View style={styles.dateContentStyle}>
          <Animated.View style={titleAnimatedStyle}>
            <Text>나는 제목</Text>
          </Animated.View>
          <Animated.View style={dateAnimatedStyle}>
            <Text>나는 날짜</Text>
          </Animated.View>
        </View>
        <View style={styles.dateContentStyle}>
          <Animated.View style={titleAnimatedStyle}>
            <Text>나는 제목</Text>
          </Animated.View>
          <Animated.View style={dateAnimatedStyle}>
            <Text>나는 날짜</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    justifyContent: 'space-between',
  },
  headerStyle: {
    backgroundColor: colors.c24242480,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    height: MAIN_HEADER_MAX_SIZE,
  },
  dateContentStyle: {flex: 1},
})

export default MainScreenHeader
