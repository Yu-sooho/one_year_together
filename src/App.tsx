import React, {useEffect} from 'react'
import {NativeModules, Platform, StyleSheet, View} from 'react-native'
import {NavigationContainer, NavigationState} from '@react-navigation/native'
import {LetterStackNavigator} from './navigations'
import {
  PermissionController,
  FirebaseController,
  ToastController,
} from './components'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import {useAppStateStore, useAuthStore} from './stores'
import {daysUntil, normalize} from './utils'
import colors from './styles/colors'
import fonts from './styles/fonts'
import LoadingController from './components/controllers/LoadingController'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import {START_DATE} from './resources'

const appGroupIdentifier = 'group.one_year_together'

async function saveTargetDate() {
  try {
    const dateStr = `${daysUntil(START_DATE)}`

    await SharedGroupPreferences.setItem(
      'daysSince',
      dateStr,
      appGroupIdentifier,
    )
    console.log('Target date saved successfully for iOS')

    // 저장된 데이터 확인
    const savedDate = await SharedGroupPreferences.getItem(
      'daysSince',
      appGroupIdentifier,
    )
    console.log('Saved date from SharedGroupPreferences:', savedDate)
  } catch (error) {
    console.error('Error saving target date', error)
  }
}
const App: React.FC = () => {
  const handleStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRoute = getActiveRouteName(state)
      console.log(`Navigated to ${currentRoute}`)
    }
  }

  const logout = useAuthStore(state => state.logout)
  const login = useAuthStore(state => state.login)

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '461587742058-tgqtkq7uonh2a6si31onk6hj79l0dk9h.apps.googleusercontent.com',
    })

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      login()
      console.log('User ID: ', user)
    } else {
      logout()
    }
  }

  const getActiveRouteName = (state: NavigationState): string => {
    const route = state.routes[state.index]
    if (route.state) {
      return getActiveRouteName(route.state as NavigationState)
    }
    return route.name
  }

  useEffect(() => {
    if (Platform.OS === 'ios') saveTargetDate()
  }, [])

  return (
    <NavigationContainer onStateChange={handleStateChange}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <LetterStackNavigator />
        </View>
        <InsetController />
      </SafeAreaProvider>
      <PermissionController />
      <FirebaseController />
      <ToastController />
      <LoadingController />
    </NavigationContainer>
  )
}

const InsetController = () => {
  const useInset = useSafeAreaInsets()
  const inset = useAppStateStore(state => state.inset)
  const setInset = useAppStateStore(state => state.setInset)

  useEffect(() => {
    if (useInset) {
      setInset(useInset)
    }
  }, [useInset])

  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toastStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
    backgroundColor: colors.cffffff,
    borderRadius: normalize(8),
  },
  toastTextStyle: {
    ...fonts.nanumgn24,
  },
})

export default App
