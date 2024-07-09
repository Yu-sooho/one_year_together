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
import {FIRST_MEET, MARRY_EVENT, START_EVENT} from '../../resources'
import fonts from '../../styles/fonts'

const HEADER_SIZE = normalize(80)

const MainScreenHeader: React.FC<MainScreenHeaderProps> = ({
  eventList,
  scrollY,
}) => {
  const inset = useSafeAreaInsets()

  const dateAnimatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [36, 20],
      Extrapolate.CLAMP,
    )
    return {
      fontSize: size,
    }
  })

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE - HEADER_SIZE],
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
        <View style={styles.firstDateView}>
          <View>
            <Text>{MARRY_EVENT.title}</Text>
          </View>
          <View>
            <Text>{MARRY_EVENT.targetAt}</Text>
          </View>
        </View>
        <View style={styles.secondDateView}>
          <View style={styles.dateContentStyle}>
            <Animated.View style={titleAnimatedStyle}>
              <Text>{FIRST_MEET.title}</Text>
            </Animated.View>
            <View>
              <Text>{FIRST_MEET.targetAt}</Text>
            </View>
          </View>
          <View style={styles.dateContentStyle}>
            <Animated.View style={titleAnimatedStyle}>
              <Text>{START_EVENT.title}</Text>
            </Animated.View>
            <View>
              <Animated.Text style={[fonts.bmjua16, dateAnimatedStyle]}>
                {START_EVENT.targetAt}
              </Animated.Text>
            </View>
          </View>
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
    height: MAIN_HEADER_MAX_SIZE,
  },
  dateContentStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
  firstDateView: {
    height: HEADER_SIZE,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  secondDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: MAIN_HEADER_MAX_SIZE - HEADER_SIZE,
    paddingBottom: normalize(12),
  },
})

export default MainScreenHeader
