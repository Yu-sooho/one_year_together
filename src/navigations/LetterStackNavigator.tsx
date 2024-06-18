import React, {useEffect, useState} from 'react'
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import MainStackNavigator from './MainStackNavigator'
import {LoginScreen, LetterScreen} from '../screens'
import {defaultScreenOptions} from '../styles/options'
import {useAppStateStore, useAuthStore, useFirebaseStore} from '../stores'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {EventController} from '../components'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import LottieSplashScreen from 'react-native-lottie-splash-screen'

const Stack = createStackNavigator<LetterStackNavigatorParamList>()

const LetterStackNavigator = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const logout = useAuthStore(state => state.logout)
  const login = useAuthStore(state => state.login)

  const loginCheck = useFirebaseStore(state => state.loginCheck)
  const isMounted = useAppStateStore(state => state.isMounted)
  const setIsMounted = useAppStateStore(state => state.setIsMounted)

  const [isLoading, setIsLoading] = useState(true)

  const isLoginCheck = async () => {
    const isLogin = await loginCheck()
    if (isLogin) {
      login()
    } else {
      logout()
    }
    LottieSplashScreen.hide()
    setIsMounted(true)
    setIsLoading(false)
  }

  useEffect(() => {
    const rehydrate = async () => {
      await AsyncStorage.getItem('auth-storage')
      isLoginCheck()
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

  if (!isMounted) return null

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
