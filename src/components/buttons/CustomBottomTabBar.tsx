import React, {memo, useCallback} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import {DEFAULT_BOTTOM_SIZE, DEFAULT_BOTTOM_TABBAR} from '../../styles/const'
import Icon from 'react-native-vector-icons/Feather'
import {normalize} from '../../utils'

const CustomBottomTabBar = memo(() => {
  const insets = useSafeAreaInsets()
  const navigation =
    useNavigation<StackNavigationProp<MainStackNavigatorParamList>>()

  const navigatedLetterListScreen = useCallback(() => {
    navigation.navigate('LetterListScreen')
  }, [navigation])

  const navigatedEditEventScreen = useCallback(() => {
    navigation.navigate('EditEventScreen', {})
  }, [navigation])

  const navigatedDdaySettingScreen = useCallback(() => {
    navigation.navigate('DdaySettingScreen')
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
      height: DEFAULT_BOTTOM_TABBAR,
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
        <Icon name="mail" size={normalize(24)} color={colors.c242424} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigatedEditEventScreen}
        style={[styles.buttonStyle, styles.centerButtonStyle]}>
        <Icon name="plus" size={normalize(26)} color={colors.c242424} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigatedDdaySettingScreen}
        style={styles.buttonStyle}>
        <Icon name="settings" size={normalize(24)} color={colors.c242424} />
      </TouchableOpacity>
    </View>
  )
})

export default CustomBottomTabBar
