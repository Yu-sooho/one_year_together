import React, {useEffect, useState} from 'react'
import {
  createStackNavigator,
  TransitionSpecs,
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack'
import MainStackNavigator from './MainStackNavigator'
import {LoginScreen, LetterScreen} from '../screens'
import {defaultScreenOptions} from '../styles/options'
import {useAuthStore} from '../stores'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {EventController} from '../components'

const Stack = createStackNavigator<LetterStackNavigatorParamList>()

const LetterStackNavigator = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const rehydrate = async () => {
      await AsyncStorage.getItem('auth-storage')
      setIsLoading(false)
    }

    rehydrate()
  }, [])

  if (isLoading) return null

  const photoEventScreenOptions: StackNavigationOptions = {
    transitionSpec: {
      open: TransitionSpecs.FadeInFromBottomAndroidSpec,
      close: TransitionSpecs.FadeOutToBottomAndroidSpec,
    },
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
  }

  return (
    <>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'MainStackNavigator' : 'LoginScreen'}
        screenOptions={defaultScreenOptions}>
        {isLoggedIn ? (
          <Stack.Screen
            name="MainStackNavigator"
            component={MainStackNavigator}
          />
        ) : (
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        )}
        <Stack.Screen
          name="LetterScreen"
          component={LetterScreen}
          options={photoEventScreenOptions}
        />
      </Stack.Navigator>
      <EventController />
    </>
  )
}

export default LetterStackNavigator
