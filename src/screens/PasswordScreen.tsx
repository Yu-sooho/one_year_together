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
  return (
    <View
      style={[
        defaultStyles.containerStyle,
        defaultStyles.centerContainerStyle,
      ]}>
      <Text>PasswordScreen</Text>
    </View>
  )
}

export default PasswordScreen
