import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {PhotoEventStackNavigator} from './navigations'
import colors from './styles/colors'

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <PhotoEventStackNavigator />
      </View>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
