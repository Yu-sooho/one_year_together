import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'
import {useEventStore} from '../stores'
import {normalize} from '../utils'
import {
  DEFAULT_BOTTOM_SIZE,
  DEFAULT_BOTTOM_TABBAR,
  MAIN_HEADER_MAX_SIZE,
  MAIN_HEADER_MIN_SIZE,
} from '../styles/const'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
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

const MainScreen: React.FC<Props> = ({navigation, route}) => {
  const inset = useSafeAreaInsets()
  const eventList = useEventStore(state => state.eventList)
  const subscribeEventList = useEventStore(state => state.subscribeEventList)
  const unsubscribeEventList = useEventStore(
    state => state.unsubscribeEventList,
  )
  const listHeight =
    Dimensions.get('window').height +
    (StatusBar.currentHeight ? StatusBar.currentHeight : 0)

  useEffect(() => {
    subscribeEventList()
    return () => unsubscribeEventList()
  }, [])

  const onPressItem = () => {}
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
  return (
    <View style={defaultStyles.containerStyle}>
      <View style={defaultStyles.containerStyle}>
        <Animated.FlatList
          data={eventList}
          onScroll={scrollHandler}
          renderItem={renderItem}
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
          <MainScreenHeader eventList={[]} />
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
