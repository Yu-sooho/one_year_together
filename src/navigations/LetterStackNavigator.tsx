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

  const fadeAndSlideScreenOptions: StackNavigationOptions = {
    transitionSpec: {
      open: {animation: 'timing', config: {duration: 500}},
      close: {animation: 'timing', config: {duration: 500}},
    },
    cardStyleInterpolator: ({current, layouts}) => {
      const {progress} = current
      return {
        cardStyle: {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      }
    },
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
          options={fadeAndSlideScreenOptions}
        />
      </Stack.Navigator>
      <EventController />
    </>
  )
}

export default LetterStackNavigator
