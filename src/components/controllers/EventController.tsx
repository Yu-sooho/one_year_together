import {memo, useCallback, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useLetterStore} from '../../stores'

const EventController = memo(() => {
  const navigation =
    useNavigation<StackNavigationProp<LetterStackNavigatorParamList>>()

  const isDuringLetter = useLetterStore(state => state.isDuringEvent)
  const currentLetter = useLetterStore(state => state.currentLetter)

  const navigatedEventScreen = useCallback(() => {
    if (isDuringLetter && currentLetter) {
      navigation.navigate('LetterScreen', {currentLetter})
    }
  }, [currentLetter, isDuringLetter, navigation])

  useEffect(() => {
    navigatedEventScreen()
  }, [navigatedEventScreen])

  return null
})

export default EventController
