import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect} from 'react'
import {View, Text, StyleSheet, FlatList, ListRenderItem} from 'react-native'
import {
  CustomBottomTabBar,
  EventListItem,
  MainScreenHeader,
} from '../components'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useEventStore} from '../stores'

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
  const eventList = useEventStore(state => state.eventList)
  const subscribeEventList = useEventStore(state => state.subscribeEventList)
  const unsubscribeEventList = useEventStore(
    state => state.unsubscribeEventList,
  )

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

  return (
    <SafeAreaView edges={['top']} style={defaultStyles.containerStyle}>
      <View style={defaultStyles.containerStyle}>
        <FlatList
          data={eventList}
          renderItem={renderItem}
          ListHeaderComponent={<MainScreenHeader eventList={[]} />}
        />
      </View>
      <CustomBottomTabBar />
    </SafeAreaView>
  )
}

const style = StyleSheet.create({})

export default MainScreen
