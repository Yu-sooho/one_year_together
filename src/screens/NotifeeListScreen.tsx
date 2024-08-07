import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useCallback} from 'react'
import {FlatList, StyleSheet, Text, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader, CustomRadioButton} from '../components'
import colors from '../styles/colors'
import {useAppStateStore, useAuthStore} from '../stores'

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
  const settingData = useAppStateStore(state => state.settingData)
  const currentUser = useAuthStore(state => state.currentUser)
  const addSetting = useAppStateStore(state => state.addSetting)
  const setIsLoading = useAppStateStore(state => state.setIsLoading)

  const updateSetting = async () => {
    await addSetting({
      isPushNotifee: !isAgreeNotifee,
      homeImageUrl: settingData?.homeImageUrl,
    })
    setIsAgreeNotifee(!isAgreeNotifee)
    setIsLoading()
  }

  const renderItem = useCallback(() => {
    return (
      <View>
        <Text>123</Text>
      </View>
    )
  }, [])

  const onPressPush = () => {
    setIsLoading()
    updateSetting()
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
