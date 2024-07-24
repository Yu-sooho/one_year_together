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
  MAIN_HEADER_HANDLE_SIZE,
  MAIN_HEADER_MAX_SIZE,
  MAIN_HEADER_MIN_SIZE,
  MAIN_HEADER_TEXT_MAX_SIZE,
  MAIN_HEADER_TEXT_MIN_SIZE,
} from '../../styles/const'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import {normalize} from '../../utils'
import {
  FIRST_DATE,
  FIRST_MEET,
  images,
  MARRY_DATE,
  MARRY_EVENT,
  START_DATE,
  START_EVENT,
} from '../../resources'
import fonts from '../../styles/fonts'
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import {useAppStateStore} from '../../stores'

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

  const imageTranslateAnimatedStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [0, -(MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE)],
      Extrapolate.CLAMP,
    )
    return {
      transform: [
        {
          translateY: translate,
        },
      ],
    }
  })

  const dateSizeAnimatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [22, 0],
      Extrapolate.CLAMP,
    )
    return {
      height: size,
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
      width: Dimensions.get('window').width,
    },
    imageContainer: {
      height: MAIN_HEADER_MAX_SIZE + inset.top + normalize(20),
      width: Dimensions.get('window').width,
    },
    content: {height: inset.top},
  })

  const AnimatedItem = ({
    title,
    targetAt,
    targetDate,
    onPress,
  }: {
    title: string
    targetAt: number
    targetDate: Date
    onPress: () => void
  }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.dateContentStyle}>
        <View style={{justifyContent: 'center'}}>
          <Animated.View style={titlePaddingAnimatedStyle}>
            <Animated.Text style={[styles.titleText]}>{title}</Animated.Text>
          </Animated.View>
          <Animated.View style={dateSizeAnimatedStyle}>
            <Animated.Text style={styles.dateText}>
              {moment(targetDate).format('YYYY.MM.DD')}
            </Animated.Text>
          </Animated.View>
          <Animated.View style={flexibleView} />
        </View>
        <View style={{justifyContent: 'center'}}>
          <Animated.View style={flexibleView} />
          <View>
            <Animated.Text style={[styles.titleText, dateAnimatedStyle]}>
              {targetAt}
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const settingData = useAppStateStore(state => state.settingData)

  return (
    <Animated.View style={[{position: 'absolute'}]}>
      <Animated.View
        style={[
          imageTranslateAnimatedStyle,
          {
            position: 'absolute',
          },
        ]}>
        <FastImage
          source={
            settingData?.homeImageUrl
              ? {uri: settingData.homeImageUrl}
              : images.default_header
          }
          style={[componentStyles.imageContainer]}
        />
        <View
          style={[
            componentStyles.imageContainer,
            {
              backgroundColor: colors.c24242480,
              position: 'absolute',
            },
          ]}
        />
      </Animated.View>
      <View style={[styles.container, componentStyles.container]}>
        <View style={componentStyles.content} />
        <View style={styles.headerStyle}>
          <Animated.View style={[styles.secondDateView, viewAnimatedStyle]}>
            {/* MainHeader */}
            <AnimatedItem
              title={FIRST_MEET.title}
              targetAt={FIRST_MEET.targetAt}
              targetDate={FIRST_DATE}
              onPress={() => {
                onPressItem(FIRST_MEET)
              }}
            />
            <AnimatedItem
              title={START_EVENT.title}
              targetAt={START_EVENT.targetAt}
              targetDate={START_DATE}
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
              <View
                style={{
                  justifyContent: 'center',
                  height: '100%',
                }}>
                <Animated.Text style={[styles.titleText]}>
                  {MARRY_EVENT.title}
                </Animated.Text>
                <Animated.View style={dateSizeAnimatedStyle}>
                  <Animated.Text style={styles.dateText}>
                    {moment(MARRY_DATE).format('YYYY.MM.DD')}
                  </Animated.Text>
                </Animated.View>
              </View>
              <View>
                <Animated.Text style={[styles.titleText, dateAnimatedStyle]}>
                  {MARRY_EVENT.targetAt}
                </Animated.Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View
        pointerEvents={'none'}
        style={[imageTranslateAnimatedStyle, styles.handleView]}>
        <View style={styles.handle} />
      </Animated.View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: normalize(12),
  },
  secondDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    ...fonts.bmjua16,
    color: colors.cffffff,
  },
  dateText: {
    ...fonts.bmjua14,
    fontSize: normalize(12),
    marginTop: normalize(4),
    color: colors.cd4d4d4,
  },
  handle: {
    height: normalize(5),
    width: normalize(20),
    backgroundColor: colors.c24242480,
    borderRadius: normalize(20),
  },
  handleView: {
    height: MAIN_HEADER_HANDLE_SIZE,
    borderTopLeftRadius: normalize(16),
    borderTopRightRadius: normalize(16),
    backgroundColor: colors.cffffff,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default MainScreenHeader
