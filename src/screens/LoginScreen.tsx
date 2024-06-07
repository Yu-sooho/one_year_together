import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'

type LoginScreenNavigationProp = StackNavigationProp<
  LoginStackNavigatorParamList,
  'LoginScreen'
>
type LoginScreenRouteProp = RouteProp<
  LoginStackNavigatorParamList,
  'LoginScreen'
>

type Props = {
  navigation: LoginScreenNavigationProp
  route: LoginScreenRouteProp
}

const LoginScreen: React.FC<Props> = ({navigation, route}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Event List"
        onPress={() => navigation.navigate('PhotoEventStackNavigator')}
      />
    </View>
  )
}

export default LoginScreen
