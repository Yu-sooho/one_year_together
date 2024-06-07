import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {LoginScreen} from '../screens'
import PhotoEventStackNavigator from './PhotoEventStackNavigator'
import {defaultScreenOptions} from '../styles/options'

const Stack = createStackNavigator<LoginStackNavigatorParamList>()

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={defaultScreenOptions}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="PhotoEventStackNavigator"
        component={PhotoEventStackNavigator}
      />
    </Stack.Navigator>
  )
}

export default LoginStackNavigator
