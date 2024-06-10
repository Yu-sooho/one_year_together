import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {
  DdaySettingScreen,
  EditEventScreen,
  EditLetterScreen,
  EventScreen,
  LockEventListScreen,
  MainScreen,
} from '../screens'
import {defaultScreenOptions} from '../styles/options'

const Stack = createStackNavigator<MainStackNavigatorParamList>()

const MainStackNavigator = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="MainScreen"
        screenOptions={defaultScreenOptions}>
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="EventScreen" component={EventScreen} />
        <Stack.Screen name="EditEventScreen" component={EditEventScreen} />
        <Stack.Screen name="EditLetterScreen" component={EditLetterScreen} />
        <Stack.Screen
          name="LockEventListScreen"
          component={LockEventListScreen}
        />
        <Stack.Screen name="DdaySettingScreen" component={DdaySettingScreen} />
      </Stack.Navigator>
    </>
  )
}

export default MainStackNavigator
