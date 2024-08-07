import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useCallback} from 'react'
import {FlatList, StyleSheet, Text, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader, CustomRadioButton} from '../components'
import colors from '../styles/colors'
import {useAppStateStore} from '../stores'

type NotifeeListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackNavigatorParamList, 'LetterListScreen'>,
  StackNavigationProp<NotifeeListScreenProps>
>

type NotifeeListScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'NotifeeListScreen'
>

type Props = {
  navigation: NotifeeListScreenNavigationProp
  route: NotifeeListScreenRouteProp
}

const NotifeeListScreen: React.FC<Props> = ({navigation, route}) => {
  const isAgreeNotifee = useAppStateStore(state => state.isAgreeNotifee)
  const setIsAgreeNotifee = useAppStateStore(state => state.setIsAgreeNotifee)

  const renderItem = useCallback(() => {
    return (
      <View>
        <Text>123</Text>
      </View>
    )
  }, [])

  const onPressPush = () => {
    setIsAgreeNotifee(!isAgreeNotifee)
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="알림" />
      <CustomRadioButton
        onPress={onPressPush}
        text={'푸시 알림 허용'}
        value={isAgreeNotifee}
      />
      <FlatList data={[]} renderItem={renderItem} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cffffff,
  },
})

export default NotifeeListScreen
