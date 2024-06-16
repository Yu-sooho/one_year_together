import React, {useEffect} from 'react'
import {StyleSheet, Text, View} from 'react-native'
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
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from 'react-native-toast-message'
import {useAppStateStore} from './stores'
import {normalize} from './utils'
import colors from './styles/colors'
import fonts from './styles/fonts'
import LoadingController from './components/controllers/LoadingController'

const App: React.FC = () => {
  const handleStateChange = (state: NavigationState | undefined) => {
    if (state) {
      const currentRoute = getActiveRouteName(state)
      console.log(`Navigated to ${currentRoute}`)
    }
  }

  const getActiveRouteName = (state: NavigationState): string => {
    const route = state.routes[state.index]
    if (route.state) {
      return getActiveRouteName(route.state as NavigationState)
    }
    return route.name
  }
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
