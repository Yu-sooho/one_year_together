import React, {useCallback} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {NavigationContainer, NavigationState} from '@react-navigation/native'
import {LetterStackNavigator} from './navigations'
import {PermissionController} from './components'

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
      // Dive into nested navigators
      return getActiveRouteName(route.state as NavigationState)
    }
    return route.name
  }

  return (
    <NavigationContainer onStateChange={handleStateChange}>
      <View style={styles.container}>
        <LetterStackNavigator />
      </View>
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
