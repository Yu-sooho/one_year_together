import React from 'react'
import {
  CardStyleInterpolators,
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack'
import {
  CustomModalScreen,
  DdaySettingScreen,
  EditEventScreen,
  EditLetterScreen,
  EventScreen,
  LetterListScreen,
  MainScreen,
} from '../screens'
import {defaultScreenOptions} from '../styles/options'

const Stack = createStackNavigator<MainStackNavigatorParamList>()

const modalScreenOptions: StackNavigationOptions = {
  presentation: 'transparentModal',
  cardStyle: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
  cardStyleInterpolator: ({current}) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
}

const MainStackNavigator = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="MainScreen"
        screenOptions={defaultScreenOptions}>
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="EventScreen" component={EventScreen} />
        <Stack.Screen name="EditLetterScreen" component={EditLetterScreen} />
        <Stack.Screen name="EditEventScreen" component={EditEventScreen} />
        <Stack.Screen name="LetterListScreen" component={LetterListScreen} />
        <Stack.Screen name="DdaySettingScreen" component={DdaySettingScreen} />
        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen
            name="CustomModalScreen"
            component={CustomModalScreen}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  )
}

export default MainStackNavigator
