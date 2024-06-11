import React from 'react'
import {StyleSheet, View} from 'react-native'
import {NavigationContainer, NavigationState} from '@react-navigation/native'
import {LetterStackNavigator} from './navigations'
import {PermissionController} from './components'
import {SafeAreaProvider} from 'react-native-safe-area-context'

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
      </SafeAreaProvider>
      <PermissionController />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
