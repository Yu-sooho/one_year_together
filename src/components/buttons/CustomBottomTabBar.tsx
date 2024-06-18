import React, {memo, useCallback} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {normalize} from '../../utils'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import {DEFAULT_BOTTOM_SIZE} from '../../styles/const'
import {GoogleSignin} from '@react-native-google-signin/google-signin'

const CustomBottomTabBar = memo(() => {
  const insets = useSafeAreaInsets()
  const navigation =
    useNavigation<StackNavigationProp<MainStackNavigatorParamList>>()

  const navigatedLetterListScreen = useCallback(() => {
    // navigation.navigate('LetterListScreen')
  }, [navigation])

  const navigatedEditEventScreen = useCallback(() => {
    // navigation.navigate('EditEventScreen')
  }, [navigation])

  const navigatedDdaySettingScreen = useCallback(() => {
    // navigation.navigate('DdaySettingScreen')
  }, [navigation])

  const styles = StyleSheet.create({
    containerStyle: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.c24242480,
      paddingBottom: +DEFAULT_BOTTOM_SIZE,
    },
    buttonStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: normalize(50),
      marginBottom: insets.bottom,
    },
    centerButtonStyle: {
      flex: 1.5,
    },
  })

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

export default CustomBottomTabBar
