import React, {memo, useCallback} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {normalize} from '../../utils'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

const CustomBottomTabBar = memo(() => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackNavigatorParamList>>()

  const navigatedLetterListScreen = useCallback(() => {
    navigation.navigate('LetterListScreen')
  }, [navigation])

  const navigatedEditEventScreen = useCallback(() => {
    navigation.navigate('EditEventScreen')
  }, [navigation])

  const navigatedDdaySettingScreen = useCallback(() => {
    navigation.navigate('DdaySettingScreen')
  }, [navigation])

  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        onPress={navigatedLetterListScreen}
        style={styles.buttonStyle}>
        <Text>Lock</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigatedEditEventScreen}
        style={[styles.buttonStyle, styles.centerButtonStyle]}>
        <Text>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigatedDdaySettingScreen}
        style={styles.buttonStyle}>
        <Text>Setting</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(50),
  },
  centerButtonStyle: {
    flex: 1.5,
  },
})

export default CustomBottomTabBar
