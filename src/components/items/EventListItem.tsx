import React, {memo} from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {daysUntil, normalize} from '../../utils'
import fonts from '../../styles/fonts'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import {PanGestureHandler} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../../styles/colors'
import {EventListitemProps} from '../../types/ComponentTypes'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = normalize(60)
const SWIPE_DEGREE = -normalize(60) * 2

const EventListItem: React.FC<EventListitemProps> = memo(
  ({item, index, onPressItem, onLongPressItem, onPressDelete, onPressEdit}) => {
    const {targetAt, title, content} = item
    const date = daysUntil(new Date(targetAt))

    const onPress = () => {
      if (translateX.value == 0) {
        onPressItem(item)
      } else {
        resetSwipe()
      }
    }

    const onLongPress = () => {
      onLongPressItem(item)
    }

    const onPressDeleteEvent = () => {
      onPressDelete(item)
      resetSwipe()
    }

    const onPressEditEvent = () => {
      onPressEdit(item)
      resetSwipe()
    }

    const translateX = useSharedValue(0)
    const lastOffset = useSharedValue(0)

    const panGestureEvent = useAnimatedGestureHandler({
      onActive: event => {
        if (lastOffset.value < 0) {
          translateX.value = lastOffset.value + event.translationX
        } else {
          translateX.value = event.translationX
        }
      },
      onEnd: () => {
        if (translateX.value < -SWIPE_THRESHOLD) {
          translateX.value = withTiming(SWIPE_DEGREE)
          lastOffset.value = withTiming(SWIPE_DEGREE)
        } else {
          translateX.value = withTiming(0)
          lastOffset.value = withTiming(0)
        }
      },
    })

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: translateX.value}],
      }
    })

    const resetSwipe = () => {
      translateX.value = withTiming(0)
      lastOffset.value = withTiming(0)
    }

    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.defaultButton, styles.editButton]}
            onPress={onPressEditEvent}>
            <Icon name="edit" size={normalize(20)} color={colors.c242424} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.defaultButton, styles.deleteButton]}
            onPress={onPressDeleteEvent}>
            <Icon name="trash-2" size={normalize(20)} color={colors.c242424} />
          </TouchableOpacity>
        </View>
        <PanGestureHandler
          activeOffsetX={[-10, 10]}
          failOffsetY={[-10, 10]}
          onGestureEvent={panGestureEvent}>
          <Animated.View
            style={[
              styles.container,
              animatedStyle,
              {
                position: 'absolute',
              },
            ]}>
            <TouchableOpacity
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={1}
              style={styles.container}>
              <Text style={styles.titleText}>{title}</Text>
              <Text style={styles.dateText}>{date}</Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    height: normalize(72),
    alignItems: 'center',
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cffffff,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: SCREEN_WIDTH,
  },
  titleText: {
    ...fonts.bmjua18,
    marginLeft: normalize(14),
  },
  dateText: {
    ...fonts.bmjua16,
    marginRight: normalize(14),
  },
  defaultButton: {
    height: normalize(72),
    width: normalize(52),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    // backgroundColor: colors.cadd8e6,
  },
  editButton: {
    // backgroundColor: colors.c98fb98,
  },
})

export default EventListItem
