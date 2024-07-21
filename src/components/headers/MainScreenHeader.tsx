import React from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {MainScreenHeaderProps} from '../../types/ComponentTypes'
import colors from '../../styles/colors'
import {
  MAIN_HEADER_MAX_SIZE,
  MAIN_HEADER_MIN_SIZE,
  MAIN_HEADER_TEXT_MAX_SIZE,
  MAIN_HEADER_TEXT_MIN_SIZE,
  MAIN_HEADER_TITLE_MAX_SIZE,
  MAIN_HEADER_TITLE_MIN_SIZE,
} from '../../styles/const'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import {normalize} from '../../utils'
import {FIRST_MEET, MARRY_EVENT, START_EVENT} from '../../resources'
import fonts from '../../styles/fonts'

const TOP_PADDING = normalize(12)

const MainScreenHeader: React.FC<MainScreenHeaderProps> = ({
  scrollY,
  onPressItem,
}) => {
  const inset = useSafeAreaInsets()

  const titlePaddingAnimatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [TOP_PADDING, 0],
      Extrapolate.CLAMP,
    )
    return {
      paddingTop: size,
    }
  })

  const dateAnimatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [MAIN_HEADER_TEXT_MAX_SIZE, MAIN_HEADER_TEXT_MIN_SIZE],
      Extrapolate.CLAMP,
    )
    return {
      fontSize: size,
    }
  })

  const viewAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [MAIN_HEADER_MIN_SIZE, MAIN_HEADER_MIN_SIZE / 2],
      Extrapolate.CLAMP,
    )
    return {
      height: translateY,
    }
  })

  const flexibleView = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [1, 0],
      Extrapolate.CLAMP,
    )
    return {
      flex: translateY,
    }
  })

  const componentStyles = StyleSheet.create({
    container: {
      height: MAIN_HEADER_MAX_SIZE + inset.top,
    },
    content: {height: inset.top, backgroundColor: colors.cffffff},
  })

  const AnimatedItem = ({
    title,
    targetAt,
    onPress,
  }: {
    title: string
    targetAt: number
    onPress: () => void
  }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.dateContentStyle}>
        <View style={{justifyContent: 'center'}}>
          <Animated.View style={titlePaddingAnimatedStyle}>
            <Animated.Text style={[fonts.bmjua16]}>{title}</Animated.Text>
          </Animated.View>
          <Animated.View style={flexibleView} />
        </View>
        <View style={{justifyContent: 'center'}}>
          <Animated.View style={flexibleView} />
          <View>
            <Animated.Text style={[fonts.bmjua16, dateAnimatedStyle]}>
              {targetAt}
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Animated.View style={[{position: 'absolute'}]}>
      <View style={[styles.container, componentStyles.container]}>
        <View style={componentStyles.content} />
        <View style={styles.headerStyle}>
          <Animated.View style={[styles.secondDateView, viewAnimatedStyle]}>
            {/* MainHeader */}
            <AnimatedItem
              title={FIRST_MEET.title}
              targetAt={FIRST_MEET.targetAt}
              onPress={() => {
                onPressItem(FIRST_MEET)
              }}
            />
            <AnimatedItem
              title={START_EVENT.title}
              targetAt={START_EVENT.targetAt}
              onPress={() => {
                onPressItem(START_EVENT)
              }}
            />
          </Animated.View>

          {/* MainHeader Marry */}
          <TouchableOpacity
            onPress={() => {
              onPressItem(MARRY_EVENT)
            }}>
            <Animated.View style={[styles.firstDateView, viewAnimatedStyle]}>
              <View>
                <Animated.Text style={[fonts.bmjua16]}>
                  {MARRY_EVENT.title}
                </Animated.Text>
              </View>
              <View>
                <Animated.Text style={[fonts.bmjua16, dateAnimatedStyle]}>
                  {MARRY_EVENT.targetAt}
                </Animated.Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    justifyContent: 'space-between',
  },
  headerStyle: {
    zIndex: 10,
    height: MAIN_HEADER_MAX_SIZE,
  },
  dateContentStyle: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: normalize(12),
  },
  firstDateView: {
    backgroundColor: colors.cffffff,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: normalize(12),
  },
  secondDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cffffff,
  },
})

export default MainScreenHeader
