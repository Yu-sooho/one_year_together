import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {LoginStackNavigator} from './navigations'

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <LoginStackNavigator />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default App
