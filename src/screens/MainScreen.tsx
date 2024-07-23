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
import {MAIN_HEADER_HANDLE_SIZE, MAIN_HEADER_MAX_SIZE} from '../styles/const'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import moment from 'moment'
import {dateToTimestamp, isSameDate, normalize} from '../utils'
import {START_DATE} from '../resources'
import colors from '../styles/colors'

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
  const deletedDefaultEvent = useEventStore(state => state.deletedDefaultEvent)
  const setDeletedDefaultEvent = useEventStore(
    state => state.setDeletedDefaultEvent,
  )
  const [list, setList] = useState<EventModel[]>([])
  const subscribeEventList = useEventStore(state => state.subscribeEventList)
  const deleteEvent = useEventStore(state => state.deleteEvent)
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

  useEffect(() => {
    subscribeEventList()
    return () => unsubscribeEventList()
  }, [])

  const onPressItem = (item: EventModel) => {
    const today = new Date()
    const targetDate = new Date(item.targetAt)
    if (isSameDate(today, targetDate)) {
      navigation.navigate('EditEventScreen', {
        event: item,
      })
      return
    }
    navigation.navigate('EventScreen', {
      event: item,
    })
  }

  const onLongPressItem = () => {}

  const deleteDateItem = (item: EventModel): void => {
    setList(prevDateList => {
      const index = prevDateList.findIndex(
        date => date.targetAt === item.targetAt,
      )

      if (index !== -1) {
        return [
          ...prevDateList.slice(0, index),
          ...prevDateList.slice(index + 1),
        ]
      }

      return prevDateList
    })
  }

  const deletedEvent = async (item: EventModel) => {
    if (item?.isDefault) {
      setDeletedDefaultEvent(item)
      deleteDateItem(item)
    } else {
      deleteEvent(item)
    }
  }

  const onPressDeleteEvent = (item: EventModel) => {
    navigation.navigate('CustomModalScreen', {
      okAction: () => deletedEvent(item),
    })
  }

  const onPressEditEvent = (item: EventModel) => {
    navigation.navigate('EditEventScreen', {isEdit: true, event: item})
  }

  const renderItem: ListRenderItem<EventModel> = ({item, index}) => {
    return (
      <EventListItem
        item={item}
        index={index}
        onPressItem={onPressItem}
        onPressEdit={onPressEditEvent}
        onPressDelete={onPressDeleteEvent}
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

    const deletedDatesSet = new Set(
      deletedDefaultEvent.map(event =>
        moment(event.targetAt).format('YYYY-MM-DD'),
      ),
    )

    const today = moment().format('YYYY-MM-DD')

    while (currentDate.isSameOrBefore(endDate)) {
      const formattedCurrentDate = currentDate.format('YYYY-MM-DD')

      if (!deletedDatesSet.has(formattedCurrentDate)) {
        const option = {
          title: `${index * 100}일`,
          content: '',
          targetAt: dateToTimestamp(currentDate.toDate()),
          isDefault: true,
        }
        if (index == 0) {
          option.title = '고백한 날'
        }
        dateList.push(option)
      }

      if (formattedCurrentDate === today && !deletedDatesSet.has(today)) {
        dateList.push({
          title: `오늘`,
          content: '',
          targetAt: dateToTimestamp(currentDate.toDate()),
          isDefault: true,
        })
      }

      currentDate = currentDate.add(daysInterval, 'days')
      index++
    }

    if (
      !deletedDatesSet.has(today) &&
      !dateList.some(
        event => moment(event.targetAt).format('YYYY-MM-DD') === today,
      )
    ) {
      dateList.push({
        title: `오늘`,
        content: `${moment().toDate()}`,
        targetAt: dateToTimestamp(moment().toDate()),
        isDefault: true,
      })
    }

    return dateList
  }

  const mergeEventDates = (
    baseDates: EventModel[],
    eventDates: EventModel[],
  ): EventModel[] => {
    const dateMap = new Map<string, EventModel>()

    const getDateKey = (timestamp: number): string => {
      const date = new Date(timestamp)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }

    baseDates.forEach(date => {
      const dateKey = getDateKey(date.targetAt)
      dateMap.set(dateKey, date)
    })

    eventDates.forEach(date => {
      const dateKey = getDateKey(date.targetAt)
      dateMap.set(dateKey, date)
    })

    const mergedDates = Array.from(dateMap.values())
    mergedDates.sort((a, b) => a.targetAt - b.targetAt)
    return mergedDates
  }
  const initDefaultDate = () => {
    const dateList = generateDates(standardDate, 100, 100)
    const mergedDates = mergeEventDates(dateList, eventList)
    setList(mergedDates)
  }

  useEffect(() => {
    initDefaultDate()
  }, [eventList])

  const navigateEventScreen = (item: EventModel) => {
    navigation.navigate('EventScreen', {
      event: item,
    })
  }

  return (
    <View style={defaultStyles.containerStyle}>
      <View style={defaultStyles.containerStyle}>
        {/* <View style={{height: MAIN_HEADER_MAX_SIZE + inset.top}} /> */}
        <Animated.FlatList
          data={list}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: listHeight,
          }}
          bounces={false}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
        <MainScreenHeader scrollY={scrollY} onPressItem={navigateEventScreen} />
      </View>
      <CustomBottomTabBar />
    </View>
  )
}

const ListHeaderComponent = () => {
  const inset = useSafeAreaInsets()
  return (
    <View
      style={{
        height: MAIN_HEADER_MAX_SIZE + MAIN_HEADER_HANDLE_SIZE + inset.top,
      }}
    />
  )
}

const ItemSeparatorComponent = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        paddingHorizontal: normalize(16),
      }}>
      <View
        style={{
          width: '100%',
          height: normalize(0.5),
          backgroundColor: colors.cf4f4f4,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {},
})

export default MainScreen
