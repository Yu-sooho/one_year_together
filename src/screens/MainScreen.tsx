import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {
  View,
  StyleSheet,
  ListRenderItem,
  Dimensions,
  StatusBar,
} from 'react-native'
import {
  CustomBottomTabBar,
  EventListItem,
  MainScreenHeader,
} from '../components'
import defaultStyles from '../styles'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useEventStore} from '../stores'
import {MAIN_HEADER_MAX_SIZE, MAIN_HEADER_MIN_SIZE} from '../styles/const'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import colors from '../styles/colors'
import moment from 'moment'
import {dateToTimestamp} from '../utils'
import {START_DATE} from '../resources'

type MainScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'MainScreen'
>
type MainScreenRouteProp = RouteProp<MainStackNavigatorParamList, 'MainScreen'>

type Props = {
  navigation: MainScreenNavigationProp
  route: MainScreenRouteProp
}

const standardDate = START_DATE

const MainScreen: React.FC<Props> = ({navigation, route}) => {
  const inset = useSafeAreaInsets()
  const eventList = useEventStore(state => state.eventList)
  const [list, setList] = useState<EventModel[]>([])
  const subscribeEventList = useEventStore(state => state.subscribeEventList)
  const unsubscribeEventList = useEventStore(
    state => state.unsubscribeEventList,
  )
  const listHeight =
    Dimensions.get('window').height +
    (StatusBar.currentHeight ? StatusBar.currentHeight : 0)

  const scrollY = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y
  })

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE],
      [0, -(MAIN_HEADER_MAX_SIZE - MAIN_HEADER_MIN_SIZE)],
      Extrapolate.CLAMP,
    )
    return {
      transform: [{translateY}],
    }
  })

  useEffect(() => {
    subscribeEventList()
    return () => unsubscribeEventList()
  }, [])

  const onPressItem = (item: EventModel) => {
    navigation.navigate('EventScreen', {
      event: item,
    })
  }

  const onLongPressItem = () => {}

  const renderItem: ListRenderItem<EventModel> = ({item, index}) => {
    return (
      <EventListItem
        item={item}
        index={index}
        onPressItem={onPressItem}
        onLongPressItem={onLongPressItem}
      />
    )
  }

  const generateDates = (
    startDate: Date,
    daysInterval: number,
    years: number,
  ): EventModel[] => {
    const dateList: EventModel[] = []
    let currentDate = moment(startDate)
    const endDate = moment(startDate).add(years, 'years')
    let index = 0

    while (currentDate.isSameOrBefore(endDate)) {
      dateList.push({
        title: `${index}`,
        content: '',
        targetAt: dateToTimestamp(currentDate.toDate()),
      })
      currentDate = currentDate.add(daysInterval, 'days')
      index++
    }

    return dateList
  }

  const mergeEventDates = (
    baseDates: EventModel[],
    eventDates: EventModel[],
  ): EventModel[] => {
    const allDates = [...baseDates, ...eventDates]
    allDates.sort((a, b) => a.targetAt - b.targetAt)
    return allDates
  }

  const initDefaultDate = () => {
    const dateList = generateDates(standardDate, 100, 100)
    const mergedDates = mergeEventDates(dateList, eventList)
    console.log(dateList)
    setList(mergedDates)
  }

  useEffect(() => {
    initDefaultDate()
  }, [eventList])

  return (
    <View style={defaultStyles.containerStyle}>
      <View style={defaultStyles.containerStyle}>
        <Animated.FlatList
          data={list}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: listHeight,
          }}
          ListHeaderComponent={
            <View style={{height: MAIN_HEADER_MAX_SIZE + inset.top}} />
          }
        />
        <Animated.View
          pointerEvents={'none'}
          style={[
            {position: 'absolute', backgroundColor: colors.cffffe0},
            headerAnimatedStyle,
          ]}>
          <MainScreenHeader scrollY={scrollY} eventList={[]} />
        </Animated.View>
      </View>
      <CustomBottomTabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {},
})

export default MainScreen
