import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import MainStackNavigator from './MainStackNavigator'
import {PhotoEventScreen} from '../screens'
import {defaultScreenOptions} from '../styles/options'

const Stack = createStackNavigator<PhotoEventStackNavigatorParamList>()

const PhotoEventStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainStackNavigator"
      screenOptions={defaultScreenOptions}>
      <Stack.Screen name="MainStackNavigator" component={MainStackNavigator} />
      <Stack.Screen name="PhotoEventScreen" component={PhotoEventScreen} />
    </Stack.Navigator>
  )
}

export default PhotoEventStackNavigator
