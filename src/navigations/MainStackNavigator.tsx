import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {
  DdaySettingScreen,
  EditEventScreen,
  EventScreen,
  LockEventListScreen,
  MainScreen,
} from '../screens'

const Stack = createStackNavigator<MainStackNavigatorParamList>()

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MainScreen">
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="EventScreen" component={EventScreen} />
      <Stack.Screen name="EditEventScreen" component={EditEventScreen} />
      <Stack.Screen
        name="LockEventListScreen"
        component={LockEventListScreen}
      />
      <Stack.Screen name="DdaySettingScreen" component={DdaySettingScreen} />
    </Stack.Navigator>
  )
}

export default MainStackNavigator
