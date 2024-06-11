import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'
import defaultStyles from '../styles'
import {useAuthStore, useEventStore} from '../stores'

type PasswordScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'PasswordScreen'
>
type PasswordScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'PasswordScreen'
>

type Props = {
  navigation: PasswordScreenNavigationProp
  route: PasswordScreenRouteProp
}

const PasswordScreen: React.FC<Props> = () => {
  const login = useAuthStore(state => state.login)
  const isDuringEvent = useEventStore(state => state.isDuringEvent)
  const closeEvent = useEventStore(state => state.closeEvent)
  const openEvent = useEventStore(state => state.openEvent)

  const onPress = () => {
    login()
    if (isDuringEvent) {
      closeEvent()
    } else {
      openEvent({id: 1})
    }
  }

  return (
    <View
      style={[
        defaultStyles.containerStyle,
        defaultStyles.centerContainerStyle,
      ]}>
      <Text>PasswordScreen</Text>
      <Button title="Go to Event List" onPress={() => onPress()} />
    </View>
  )
}

export default PasswordScreen
