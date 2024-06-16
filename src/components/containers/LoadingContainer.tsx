import React, {memo} from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import colors from '../../styles/colors'

const LoadingContainer = memo(() => {
  return (
    <View style={styles.container}>
      <Text>123</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.c24242480,
    position: 'absolute',
  },
})

export default LoadingContainer
