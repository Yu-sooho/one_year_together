import React, {memo, useCallback, useEffect} from 'react'
import {Text, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useEventStore} from '../stores'

const EventController = memo(() => {
  const navigation =
    useNavigation<StackNavigationProp<PhotoEventStackNavigatorParamList>>()

  const isDuringEvent = useEventStore(state => state.isDuringEvent)
  const currentEvent = useEventStore(state => state.currentEvent)

  const navigatedEventScreen = useCallback(() => {
    if (isDuringEvent && currentEvent) {
      navigation.navigate('PhotoEventScreen', {currentEvent})
    }
  }, [currentEvent, isDuringEvent, navigation])

  useEffect(() => {
    navigatedEventScreen()
  }, [navigatedEventScreen])

  useEffect(() => {
    console.log(isDuringEvent, 'FUFU2')
  }, [isDuringEvent])

  return null
})

export default EventController
