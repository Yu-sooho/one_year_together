import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Text,
  Button,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Dimensions,
} from 'react-native'
import defaultStyles from '../styles'
import FastImage from 'react-native-fast-image'
import {CustomBackgroundOpacity, CustomHeader} from '../components'
import {SafeAreaView} from 'react-native-safe-area-context'
import colors from '../styles/colors'
import {daysUntil} from '../utils'

type EventScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'EventScreen'
>
type EventScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'EventScreen'
>

type Props = {
  navigation: EventScreenNavigationProp
  route: EventScreenRouteProp
}

const EventScreen: React.FC<Props> = ({navigation, route}) => {
  const {event} = route?.params
  const flatListRef = useRef<FlatList<string>>(null)
  const scrollIndex = useRef(0)
  const animInterval = useRef<any>(null)

  const renderItem: ListRenderItem<string> = ({item, index}) => {
    return (
      <View>
        <FastImage style={styles.imageStyle} source={{uri: item}} />
        <CustomBackgroundOpacity />
      </View>
    )
  }

  const eventAnimatedInit = () => {
    if (!event || !event.imageUrl || event.imageUrl.length <= 0) return
    animInterval.current = setInterval(() => {
      if (flatListRef.current) {
        scrollIndex.current =
          (scrollIndex.current + 1) %
          (event.imageUrl ? event.imageUrl.length : 0)
        flatListRef.current.scrollToIndex({
          animated: true,
          index: scrollIndex.current,
        })
      }
    }, 2000)
  }

  useEffect(() => {
    eventAnimatedInit()
    return () => clearInterval(animInterval.current)
  }, [])

  const date = daysUntil(new Date(event?.targetAt))

  return (
    <View style={defaultStyles.centerContainerStyle}>
      {event.imageUrl && (
        <FlatList
          ref={flatListRef}
          pointerEvents="none"
          horizontal
          pagingEnabled
          style={styles.listContainer}
          renderItem={renderItem}
          data={event.imageUrl}
          bounces={false}
        />
      )}
      <SafeAreaView style={event.imageUrl ? styles.container : styles.noImage}>
        <CustomHeader
          title={event.title}
          containerStyle={
            event.imageUrl && {backgroundColor: colors.transparent}
          }
          iconColor={event.imageUrl && colors.cffffff}
          titleStyle={event.imageUrl && {color: colors.cffffff}}
        />
        <View style={styles.content}>
          <Text>{event.content}</Text>
          <Text>{date}</Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  imageStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  noImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colors.cffffff,
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  content: {flex: 1, justifyContent: 'center', alignItems: 'center'},
})

export default EventScreen
